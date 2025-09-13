import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EventEmitter, inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';

import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { LoggerService } from 'serendipity-utils-lib';

import { DynamicFormControl, DynamicFormControlCustomEvent, DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { DynamicDatepicker } from '../../components/dynamic-datepicker/dynamic-datepicker';
import { DynamicImage } from '../../components/dynamic-image/dynamic-image';
import { DynamicInput } from '../../components/dynamic-input/dynamic-input';
import { DynamicLabel } from '../../components/dynamic-label/dynamic-label';

const components = {
  date: DynamicDatepicker,
  image: DynamicImage,
  input: DynamicInput,
  label: DynamicLabel
};

@Directive({
  selector: '[dynamicControl]'
})
export class DynamicControlDirective  implements OnInit, OnDestroy  {

  @Input() formGroup!: FormGroup;
  @Input() model!: DynamicFormControlModel;

  @Output() customEvent = new EventEmitter<DynamicFormControlCustomEvent>();

  protected componentRef!: ComponentRef<DynamicFormControl>;
  protected componentSubscriptions: Subscription[] = [];

  private resolver: ComponentFactoryResolver = inject(ComponentFactoryResolver);
  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  protected logger: LoggerService = inject(LoggerService);

  public ngOnInit() {

    // this.logger.info('Dynamic Control Directive: ngOnInit()');

    this.createDynamicFormControlComponent();
  }

  public ngOnDestroy() {

    this.destroyDynamicFormControlComponent();
  }

  private createDynamicFormControlComponent() {

    // this.logger.info('Dynamic Control Directive: createDynamicFormControlComponent()');

    // @ts-ignore
    if (!components[this.model.type]) {

      const supportedTypes = Object.keys(components).join(', ');

      this.logger.info(`You tried to use an unsupported type (${this.model.type}). Supported types: ${supportedTypes}`);

    } else {

      // @ts-ignore
      const factory = this.resolver.resolveComponentFactory(components[this.model.type]);
      this.componentRef = this.viewContainerRef.createComponent(factory) as ComponentRef<DynamicFormControl>;

      const instance = this.componentRef.instance;

      instance.formGroup = this.formGroup;
      instance.model = this.model;

      if (instance.customEvent !== undefined) {

        // this.logger.info('Dynamic Control Directive: instance.customEvent.subscribe()');

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

    this.logger.info('Dynamic Control Directive: onCustomEvent()');

    this.customEvent.emit(event);
  }

}
