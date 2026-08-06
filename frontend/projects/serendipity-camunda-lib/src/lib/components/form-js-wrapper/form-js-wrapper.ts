import {
  AfterViewInit,
  Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { Form } from '@bpmn-io/form-js-viewer';

import { Subscription } from 'rxjs';

import { LoggerService } from 'serendipity-utils-lib';

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

  protected logger = inject(LoggerService);

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
        await this.formInstance.importSchema(this.schema, this.data);
      } catch (err) {
        this.logger.error(err);
      }
    }

  }

}

/*


  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('FormJsWrapper Component: ngOnChanges()');

    this.unsubscribe();
    this.subscribe();

  }

*/
