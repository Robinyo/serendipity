import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output,
  NgZone, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { Form } from '@bpmn-io/form-js-viewer';
import { CustomFormFieldsModule } from '../form-js-extensions/search-field/render/custom-form-fields';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { LoggerService } from 'serendipity-utils-lib';

import { getDeepDiff, ObjectDiff } from '../../utils/object-diff/object-diff';

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

  @Output() buttonClick = new EventEmitter<{ field: any; value: any }>();

  protected formInstance!: Form;
  protected subscriptions: Subscription[] = [];

  protected changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected zone: NgZone = inject(NgZone);
  protected logger = inject(LoggerService);

  protected dirty: boolean = false;
  protected valid: boolean = false;

  private initialData!: any;
  private formChanges$ = new Subject<any>();

  constructor() {
    this.logger.info('FormJsWrapper Component: constructor()');
  }

  ngOnInit(): void {
    this.logger.info('FormJsWrapper Component: ngOnInit()');

    this.formInstance = new Form({
      container: this.formWrapper.nativeElement,
      additionalModules: [
        CustomFormFieldsModule
      ]
    });

    const changeSubscription = this.formChanges$.pipe(
      debounceTime(200),
      map((event: any) => {
        const currentErrors = event.errors || {};
        const schemaWhitelist = this.extractEditableKeysFromSchema();
        const currentData: any = {};

        schemaWhitelist.forEach(key => {
          if (key in event.data) {
            currentData[key] = event.data[key];
          }
        });

        const changes: ObjectDiff = getDeepDiff(this.initialData, currentData);
        const isDirty = Object.keys(changes).length > 0;
        const isValid = Object.keys(currentErrors).length === 0;

        if (isDirty) {
          this.logger.info('Detected differences: ' + JSON.stringify(changes, null, 2) + '\n');
        }

        return { event, isDirty, isValid, stateKey: `${isDirty}-${isValid}` };
      }),
      distinctUntilChanged((prev, curr) => prev.stateKey === curr.stateKey)
    ).subscribe(({ isDirty, isValid }) => {
      this.zone.run(() => {
        this.dirty = isDirty;
        this.valid = isValid;
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

  public resetPristineState(updatedData: any): void {
    this.logger.info('FormJsWrapper Component: resetPristineState()');

    const schemaWhitelist = this.extractEditableKeysFromSchema();
    const cleanAdaptedData = JSON.parse(JSON.stringify(updatedData));
    const normalizedData: any = {};

    schemaWhitelist.forEach(key => {
      if (key in cleanAdaptedData) {
        normalizedData[key] = cleanAdaptedData[key];
      }
    });

    if (this.formInstance) {
      const activeFormState = this.formInstance.submit().data;

      Object.keys(normalizedData).forEach(key => {
        const val = normalizedData[key];

        if ((val === null || val === '') && (activeFormState[key] === undefined || activeFormState[key] === '')) {
          normalizedData[key] = activeFormState[key];
        }
      });
    }

    this.initialData = normalizedData;
    this.dirty = false;
    this.changeDetectorRef.markForCheck();
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

  public isDirty(): boolean {
    return this.dirty;
  }

  public isValid(): boolean {
    return this.valid;
  }

  public getData(): any {
    if (this.formInstance) {
      const { data } = this.formInstance.submit();
      return data;
    }
    return {};
  }

  private async loadForm(): Promise<void> {
    this.logger.info('FormJsWrapper Component: loadForm()');

    if (this.schema) {
      try {
        const schemaWhitelist = this.extractEditableKeysFromSchema();
        const cleanInitialData = JSON.parse(JSON.stringify(this.data || {}));
        const filteredInitialData: any = {};

        schemaWhitelist.forEach(key => {
          if (key in cleanInitialData) {
            filteredInitialData[key] = cleanInitialData[key];
          }
        });

        this.initialData = filteredInitialData;

        await this.formInstance.importSchema(this.schema, this.data);

        // Native DOM event listener capture
        const container = this.formWrapper.nativeElement as HTMLElement;
        container.addEventListener('searchFieldButtonClick', (event: any) => {
          this.zone.run(() => {
            // this.logger.info('Search field button clicked (DOM):', event.detail);
            this.buttonClick.emit(event.detail);
          });
        });

        this.formInstance.on('changed', (event: any) => {
          this.formChanges$.next(event);
        });

      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  // Whitelists exact keys + root object names for dot-notation bindings
  private extractEditableKeysFromSchema(): Set<string> {
    const keys = new Set<string>();

    if (this.schema && Array.isArray(this.schema.components)) {
      this.schema.components.forEach((component: any) => {
        if (component.key && typeof component.key === 'string') {
          keys.add(component.key);

          // If path uses dot-notation (e.g., "organisation.displayName"), preserve root key "organisation"
          if (component.key.includes('.')) {
            const rootKey = component.key.split('.')[0];
            keys.add(rootKey);
          }
        }
      });
    }

    return keys;
  }

}




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

/*
import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output,
  NgZone, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { Form } from '@bpmn-io/form-js-viewer';
import { CustomFormFieldsModule } from '../form-js-extensions/search-field/render/custom-form-fields';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { LoggerService } from 'serendipity-utils-lib';

import { getDeepDiff, ObjectDiff } from '../../utils/object-diff/object-diff';

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

  @Output() buttonClick = new EventEmitter<{ field: any; value: any }>();

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
      container: this.formWrapper.nativeElement,
      additionalModules: [
        CustomFormFieldsModule
      ]
    });

    this.formInstance.on('searchFieldButton.click', (event: any) => {
      this.zone.run(() => {
        this.logger.info('Search field button clicked:', event);
        this.buttonClick.emit(event.data);
      });
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
        const schemaWhitelist = this.extractEditableKeysFromSchema();
        const cleanInitialData = JSON.parse(JSON.stringify(this.data || {}));
        const filteredInitialData: any = {};

        schemaWhitelist.forEach(key => {
          if (key in cleanInitialData) {
            filteredInitialData[key] = cleanInitialData[key];
          }
        });

        this.initialData = filteredInitialData;

        await this.formInstance.importSchema(this.schema, this.data);

        // Capture DOM CustomEvent directly from wrapper element
        const container = this.formWrapper.nativeElement as HTMLElement;
        container.addEventListener('searchFieldButtonClick', (event: any) => {
          this.zone.run(() => {
            this.logger.info('Search field button clicked (DOM):', event.detail);
            this.buttonClick.emit(event.detail);
          });
        });

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
        if (component.key && typeof component.key === 'string') {
          // Add exact key (e.g. "organisation.displayName")
          keys.add(component.key);

          // If dot notation is used, also preserve the root property name (e.g. "organisation")
          if (component.key.includes('.')) {
            const rootKey = component.key.split('.')[0];
            keys.add(rootKey);
          }
        }
      });
    }

    return keys;
  }

}

*/

/*

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

*/



/*

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

*/
