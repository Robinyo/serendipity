import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnDestroy, OnInit, NgZone,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { Form } from '@bpmn-io/form-js-viewer';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { LoggerService } from 'serendipity-utils-lib';

import { getDeepDiff, ObjectDiff } from '../../utils/object-diff/object-diff';

/**
 * FormJsWrapper
 *
 * Zero unnecessary zone entries: Angular is never woken up while typing within a single state block.
 * Even after the 200ms debounce finish timer hits, if you type another word but the form stays dirty and valid,
 * this.zone.run() skips completely.
 *
 * Deterministic UI triggers: this.changeDetectorRef.markForCheck() now only requests layout passes from your container
 * template when it is strictly necessary to enable/disable button sets.
 */

@Component({
  selector: 'form-js-wrapper',
  standalone: true,
  template: `<div #formWrapper class="form-wrapper"></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './form-js-wrapper.scss'
})
export class FormJsWrapper implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('formWrapper', { static: true }) formWrapper!: ElementRef;

  @Input() schema!: any;
  @Input() data!: any;

  protected formInstance!: Form;
  protected subscriptions: Subscription[] = [];

  protected changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected zone: NgZone = inject(NgZone);
  protected logger = inject(LoggerService);

  // Tracks evaluated states for the template buttons
  protected dirty: boolean = false;
  protected valid: boolean = false;

  private initialData!: any;

  // RxJS stream to capture rapid form changes
  private formChanges$ = new Subject<any>();

  constructor() {
    this.logger.info('FormJsWrapper Component: constructor()');
  }

  ngOnInit(): void {

    this.logger.info('FormJsWrapper Component: ngOnInit()');

    this.formInstance = new Form({
      container: this.formWrapper.nativeElement
    });

    // Handle form change processing with a 200ms debounce
    const changeSubscription = this.formChanges$.pipe(
      debounceTime(200),

      // 1. Pre-calculate states outside the Angular zone to see if anything actually changed
      map((event: any) => {
        const currentErrors = event.errors || {};

        // 🚀 THE GENERALISED SCHEMA FILTER:
        // Extract only the fields actively declared on screen to prevent structural pollution
        const schemaWhitelist = this.extractEditableKeysFromSchema();
        const currentData: any = {};

        schemaWhitelist.forEach(key => {
          if (key in event.data) {
            currentData[key] = event.data[key];
          }
        });

        // Calculate deep diff against a perfectly matched baseline structure
        const changes: ObjectDiff = getDeepDiff(this.initialData, currentData);
        const isDirty = Object.keys(changes).length > 0;
        const isValid = Object.keys(currentErrors).length === 0;

        if (isDirty) {
          this.logger.info('Detected differences: ' + JSON.stringify(changes, null, 2) + '\n');
        }

        // Return a combined payload of the filtered data and the boolean states
        return { event, isDirty, isValid, stateKey: `${isDirty}-${isValid}` };
      }),

      // 2. Only pass the data forward if the combined dirty/valid state combination flipped
      distinctUntilChanged((prev, curr) => prev.stateKey === curr.stateKey)

    ).subscribe(({ event, isDirty, isValid }) => {

      // 3. This block now runs ONLY when state changes (e.g., pristine -> dirty, or invalid -> valid)
      this.zone.run(() => {
        this.dirty = isDirty;
        this.valid = isValid;

        // 4. Logs will now only fire exactly when the states cross a threshold
        if (this.dirty) {
          this.logger.info('FormJsWrapper Component: User has modified fields');
        } else {
          this.logger.info('FormJsWrapper Component: Form data matches initial content');
        }

        if (this.valid) {
          this.logger.info('Task Component: All required fields are complete');
        } else {
          this.logger.info('Task Component: Form has errors');
        }

        // 5. Request a UI check only on state updates
        this.changeDetectorRef.markForCheck();
      });

    });

    this.subscriptions.push(changeSubscription);
  }

  public ngAfterViewInit() {
    this.logger.info('FormJsWrapper Component: ngAfterViewInit()');
    this.subscribe();
  }

  public ngOnDestroy() {
    this.logger.info('FormJsWrapper Component: ngOnDestroy()');
    this.unsubscribe();
    if (this.formInstance) {
      this.formInstance.destroy();
    }
  }

  // Call this method after a successful HTTP PUT save operation.
  // It synchronises your baseline data tracking reference to clear the dirty flag!

  // Synchronises your baseline data tracking reference to clear the dirty flag cleanly!
  // Automatically isolates fields using schema reflection to prevent structural pollution.

  public resetPristineState(updatedData: any): void {

    this.logger.info('FormJsWrapper Component: resetPristineState() aligning tracking baselines via schema reflection');

    // 1. Dynamic Extraction: Discover exactly which fields on-screen can change
    const schemaWhitelist = this.extractEditableKeysFromSchema();

    // 2. Clone the adapted parent model state
    const cleanAdaptedData = JSON.parse(JSON.stringify(updatedData));
    const normalizedData: any = {};

    // 3. 🚀 GENERALISED WHITE-LISTING:
    // Only map values into our tracking baseline if they are actively rendered in the UI!
    // This cleanly drops metadata like id, type, addresses, and individual automatically.
    schemaWhitelist.forEach(key => {
      if (key in cleanAdaptedData) {
        normalizedData[key] = cleanAdaptedData[key];
      }
    });

    // 4. THE USER-INTERACTION ALIGNER:
    // Sync null vs undefined discrepancies between the server response and the UI state engine
    if (this.formInstance) {
      const activeFormState = this.formInstance.submit().data;

      Object.keys(normalizedData).forEach(key => {
        const val = normalizedData[key];

        if ((val === null || val === '') && (activeFormState[key] === undefined || activeFormState[key] === '')) {
          normalizedData[key] = activeFormState[key];
        }
      });
    }

    // 5. Commit the pristine baseline state values securely
    this.initialData = normalizedData;
    this.dirty = false;
    this.changeDetectorRef.markForCheck();

    this.logger.info('FormJsWrapper Component: Pristine state synchronized successfully.');
  }

  protected subscribe(): void {
    this.logger.info('FormJsWrapper Component: subscribe()');
    this.loadForm();
  }

  protected unsubscribe(): void {
    this.logger.info('FormJsWrapper Component: unsubscribe()');
    this.schema = null;
    this.data = {};
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  //
  // Validation Getters (now lightweight, pointing to debounced primitives)
  //

  public isDirty(): boolean {
    return this.dirty;
  }

  public isValid(): boolean {
    return this.valid;
  }

  public getData(): any {

    if (this.formInstance) {
      // .submit() safely generates the data object and handles final validation
      const { data } = this.formInstance.submit();
      return data;
    }

    return {};

  }

  //
  // Misc
  //

  private async loadForm(): Promise<void> {

    this.logger.info('FormJsWrapper Component: loadForm()');

    if (this.schema) {
      try {
        // 🚀 THE INITIALISATION BALANCE:
        // Extract the schema whitelist right away to shape initialData perfectly on page load!
        const schemaWhitelist = this.extractEditableKeysFromSchema();
        const cleanInitialData = JSON.parse(JSON.stringify(this.data || {}));
        const filteredInitialData: any = {};

        schemaWhitelist.forEach(key => {
          if (key in cleanInitialData) {
            filteredInitialData[key] = cleanInitialData[key];
          }
        });

        this.initialData = filteredInitialData;

        // Load the UI framework instance canvas
        await this.formInstance.importSchema(this.schema, this.data);

        // This listener executes purely outside Angular's zone on every keyup
        this.formInstance.on('changed', (event: any) => {
          this.formChanges$.next(event);
        });

      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  // Inspects the Camunda form-js JSON structure to compile a whitelist
  // of keys that are explicitly bound to user-editable fields!

  private extractEditableKeysFromSchema(): Set<string> {
    const keys = new Set<string>();

    if (this.schema && Array.isArray(this.schema.components)) {
      this.schema.components.forEach((component: any) => {
        // Only collect components that possess a valid data model binding 'key'
        if (component.key && typeof component.key === 'string') {
          keys.add(component.key);
        }
      });
    }

    return keys;
  }

}



/*

  ngOnInit(): void {

    this.logger.info('FormJsWrapper Component: ngOnInit()');

    this.formInstance = new Form({
      container: this.formWrapper.nativeElement
    });

    // Handle form change processing with a 200ms debounce
    const changeSubscription = this.formChanges$.pipe(
      debounceTime(200),

      // 1. Pre-calculate states outside the Angular zone to see if anything actually changed
      map((event: any) => {
        const currentData = event.data;
        const currentErrors = event.errors || {};

        // Calculate deep diff instead of raw string comparison
        const changes: ObjectDiff = getDeepDiff(this.initialData, currentData);
        const isDirty = Object.keys(changes).length > 0;
        const isValid = Object.keys(currentErrors).length === 0;

        if (isDirty) {
          this.logger.info('Detected differences: ' + JSON.stringify(changes, null, 2) + '\n');
        }

        // Return a combined payload of the raw data and the boolean states
        return { event, isDirty, isValid, stateKey: `${isDirty}-${isValid}` };
      }),

      // 2. Only pass the data forward if the combined dirty/valid state combination flipped
      distinctUntilChanged((prev, curr) => prev.stateKey === curr.stateKey)

    ).subscribe(({ event, isDirty, isValid }) => {

      // 3. This block now runs ONLY when state changes (e.g., pristine -> dirty, or invalid -> valid)
      this.zone.run(() => {
        this.dirty = isDirty;
        this.valid = isValid;

        // 4. Logs will now only fire exactly when the states cross a threshold
        if (this.dirty) {
          this.logger.info('FormJsWrapper Component: User has modified fields');
        } else {
          this.logger.info('FormJsWrapper Component: Form data matches initial content');
        }

        if (this.valid) {
          this.logger.info('Task Component: All required fields are complete');
        } else {
          this.logger.info('Task Component: Form has errors');
        }

        // 5. Request a UI check only on state updates
        this.changeDetectorRef.markForCheck();
      });

    });

    this.subscriptions.push(changeSubscription);
  }


  private async loadForm(): Promise<void> {

    this.logger.info('FormJsWrapper Component: loadForm()');

    if (this.schema) {
      try {
        this.initialData = this.data;
        await this.formInstance.importSchema(this.schema, this.data);

        // This listener executes purely outside Angular's zone on every keyup.
        // It bypasses Angular tracking entirely until debounce completes.
        this.formInstance.on('changed', (event: any) => {
          this.formChanges$.next(event);
        });

      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  public resetPristineState(updatedData: any): void {

    this.logger.info('FormJsWrapper Component: resetPristineState()');

    // Establish the new baseline for future change comparison passes
    this.initialData = JSON.parse(JSON.stringify(updatedData));

    // Form-js retains empty controls as undefined/empty strings. If the form instance exists,
    // we extract its normalized schema output directly to align our comparison baselines!
    if (this.formInstance) {
      const { data } = this.formInstance.submit();

      // Update our initial data reference to match exactly what form-js internally resolved,
      // smoothing over any null vs undefined vs empty string type discrepancies!
      this.initialData = JSON.parse(JSON.stringify(data));
    }

    // Clear the dirty state flag instantly
    this.dirty = false;

    // Inform the view engine to refresh presentation elements
    this.changeDetectorRef.markForCheck();
  }

*/

/*

  ngOnInit(): void {

    this.logger.info('FormJsWrapper Component: ngOnInit()');

    this.formInstance = new Form({
      container: this.formWrapper.nativeElement
    });

    // Handle form change processing with a 200ms debounce
    const changeSubscription = this.formChanges$.pipe(
      debounceTime(200),

      // 1. Pre-calculate states outside the Angular zone to see if anything actually changed
      map((event: any) => {
        const currentData = event.data;
        const currentErrors = event.errors || {};

        const isDirty = JSON.stringify(this.initialData) !== JSON.stringify(currentData);
        const isValid = Object.keys(currentErrors).length === 0;

        if (isDirty) {
          // const ignoredFields = ["addresses", "roles"];
          // const cleanedData = omitKeys(this.initialData, ignoredFields);
          // const changes: ObjectDiff = getDeepDiff(cleanedData, currentData);

          const changes: ObjectDiff = getDeepDiff(this.initialData, currentData);

          this.logger.info('Detected differences: ' + JSON.stringify(changes, null, 2) + '\n');

          // this.logger.info('this.initialData: ' + JSON.stringify(this.initialData, null, 2) + '\n');
          // this.logger.info('currentData: ' + JSON.stringify(currentData, null, 2) + '\n');
        }

        // Return a combined payload of the raw data and the boolean states
        return { event, isDirty, isValid, stateKey: `${isDirty}-${isValid}` };
      }),

      // 2. Only pass the data forward if the combined dirty/valid state combination flipped
      distinctUntilChanged((prev, curr) => prev.stateKey === curr.stateKey)

    ).subscribe(({ event, isDirty, isValid }) => {

      // 3. This block now runs ONLY when state changes (e.g., pristine -> dirty, or invalid -> valid)
      this.zone.run(() => {
        this.dirty = isDirty;
        this.valid = isValid;

        // 4. Logs will now only fire exactly when the states cross a threshold
        if (this.dirty) {
          this.logger.info('FormJsWrapper Component: User has modified fields');
        } else {
          this.logger.info('FormJsWrapper Component: Form data matches initial content');
        }

        if (this.valid) {
          this.logger.info('Task Component: All required fields are complete');
        } else {
          this.logger.info('Task Component: Form has errors');
        }

        // 5. Request a UI check only on state updates
        this.changeDetectorRef.markForCheck();
      });

    });

    this.subscriptions.push(changeSubscription);
  }

*/
