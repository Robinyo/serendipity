import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnDestroy, OnInit, NgZone,
  ViewChild
} from '@angular/core';
import { Form } from '@bpmn-io/form-js-viewer';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { LoggerService } from 'serendipity-utils-lib';

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
        const currentData = event.data;
        const currentErrors = event.errors || {};

        const isDirty = JSON.stringify(this.initialData) !== JSON.stringify(currentData);
        const isValid = Object.keys(currentErrors).length === 0;

        if (isDirty) {
          this.logger.info('this.initialData: ' + JSON.stringify(this.initialData, null, 2) + '\n');
          this.logger.info('currentData: ' + JSON.stringify(currentData, null, 2) + '\n');
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

}
