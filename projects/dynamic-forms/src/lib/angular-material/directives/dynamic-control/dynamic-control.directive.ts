import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';

import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { DynamicFormControl, DynamicFormControlCustomEvent, DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { DynamicDatepickerComponent } from '../../components/dynamic-datepicker/dynamic-datepicker.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';

import { LoggerService } from 'utils';

const components = {
  date: DynamicDatepickerComponent,
  input: DynamicInputComponent
};

@Directive({
  selector: '[dynamicControl]'
})
export class DynamicControlDirective  implements OnInit, OnDestroy  {

  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;

  @Output() customEvent = new EventEmitter<DynamicFormControlCustomEvent>();

  protected componentRef: ComponentRef<DynamicFormControl>;
  protected componentSubscriptions: Subscription[] = [];

  constructor(private resolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef,
              private logger: LoggerService) {

  }

  public ngOnInit() {

    // this.logger.info('DynamicControlDirective: ngOnInit()');

    this.createDynamicFormControlComponent();
  }

  public ngOnDestroy() {

    this.destroyDynamicFormControlComponent();
  }

  private createDynamicFormControlComponent() {

    // this.logger.info('DynamicControlDirective: createDynamicFormControlComponent()');

    if (!components[this.model.type]) {

      const supportedTypes = Object.keys(components).join(', ');

      this.logger.info(`You tried to use an unsupported type (${this.model.type}). Supported types: ${supportedTypes}`);

    } else {

      const factory = this.resolver.resolveComponentFactory(components[this.model.type]);
      this.componentRef = this.viewContainerRef.createComponent(factory) as ComponentRef<DynamicFormControl>;

      const instance = this.componentRef.instance;

      instance.formGroup = this.formGroup;
      instance.model = this.model;

      if (instance.customEvent !== undefined) {

        // this.logger.info('DynamicControlDirective: instance.customEvent.subscribe()');

        this.componentSubscriptions.push(
          instance.customEvent.subscribe((event: DynamicFormControlCustomEvent) => this.onCustomEvent(event)));
      }

    }

  }

  private destroyDynamicFormControlComponent() {

    if (this.componentRef) {

      this.componentSubscriptions.forEach(subscription => {

        // this.logger.info('DynamicControlDirective: instance.customEvent.unsubscribe()');

        subscription.unsubscribe();
      });

      this.componentSubscriptions = [];
      this.componentRef.destroy();

    }

  }

  onCustomEvent(event: DynamicFormControlCustomEvent): void {

    this.logger.info('DynamicControlDirective: onCustomEvent()');

    // const emitter = this.customEvent as EventEmitter<any>;
    // emitter.emit($event);
    this.customEvent.emit(event);
  }

}

// https://github.com/gund/ng-dynamic-component

/*

  // @Output() customEvent = new EventEmitter<any>();
  // customEvent: EventEmitter<any> | undefined;
  // customEvent = new EventEmitter<any>();

  @HostListener('dynamicEvent', ['$event.target'])
  public onEvent($event: any) {

    this.logger.info('DynamicControlDirective: onEvent()');
  }

*/
