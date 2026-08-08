import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, isDevMode, OnDestroy, OnInit, NgZone,
  ViewChild
} from '@angular/core';
import { Form } from '@bpmn-io/form-js-viewer';

import { Subscription } from 'rxjs';

import { LoggerService } from 'serendipity-utils-lib';

const noop = (): any => undefined;

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

  protected dirty: boolean = false;

  private initialData!: any;

  constructor() {
    this.logger.info('FormJsWrapper Component: constructor()');
  }

  ngOnInit(): void {

    this.logger.info('FormJsWrapper Component: ngOnInit()');

    this.formInstance = new Form({
      container: this.formWrapper.nativeElement
    });

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

    // this.formInstance = null;
    this.schema = null;
    this.data = {};

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  private async loadForm(): Promise<void> {

    this.logger.info('FormJsWrapper Component: loadForm()');

    if (this.schema) {

      try {

        this.initialData = this.data;

        await this.formInstance.importSchema(this.schema, this.data);

        this.formInstance.on('changed', (event: any) => {

          // Wrap the execution inside Angular's Zone
          this.zone.run(() => {

            const currentData = event.data;
            const currentErrors = event.errors;

            // Compare values to check if data is modified
            this.dirty = JSON.stringify(this.initialData) !== JSON.stringify(currentData);

            if (this.dirty) {
              this.logger.info('FormJsWrapper Component: User has modified fields');
            } else {
              this.logger.info('FormJsWrapper Component: Form data matches initial content');
            }

            // Note: Angular handles bindings now, but if you use ChangeDetectionStrategy.OnPush,
            // you can keep this clean fallback:
            this.changeDetectorRef.markForCheck();

          });

        });

      } catch (err) {
        this.logger.error(err);
      }

    }

  }

  //
  // Validation
  //

  public isDirty(): boolean {

    return this.dirty;
  }

  public isValid(): boolean {

    let valid = false;

    const { data, errors } = this.formInstance.submit();

    if (Object.keys(errors).length === 0) {

      this.logger.info('Task Component: All required fields are complete');

      valid = true;

    }

    return valid;

  }

}

/*


  protected detectChanges() {

    // The error "Expression has changed after it was checked" in Angular, specifically with an Angular Material
    // table's dataSource, indicates that a binding expression's value changed during or immediately after
    // Angular's change detection cycle, but before the view could be re-rendered to reflect this change.
    // This error typically occurs in development mode, where Angular performs an extra check to ensure view stability.

    if (isDevMode()) {
      return this.changeDetector.detectChanges();
    } else {
      return noop;
    }

  }

  private async loadForm(): Promise<void> {

    this.logger.info('FormJsWrapper Component: loadForm()');

    if (this.schema) {

      try {

        this.initialData = this.data;

        await this.formInstance.importSchema(this.schema, this.data);

        this.formInstance.on('changed', (event: any) => {

          const currentData = event.data;     // The real-time user-modified form values
          const currentErrors = event.errors; // Optional tracker for validation checks

          // Compare values to check if data is modified
          this.dirty = JSON.stringify(this.initialData) !== JSON.stringify(currentData);

          if (this.dirty) {
            this.logger.info('FormJsWrapper Component: User has modified fields');
          } else {
            this.logger.info('FormJsWrapper Component: Form data matches initial content');
          }

          this.detectChanges();

        });

      } catch (err) {
        this.logger.error(err);
      }

    }

  }

*/

/*


  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('FormJsWrapper Component: ngOnChanges()');

    this.unsubscribe();
    this.subscribe();

  }

*/
