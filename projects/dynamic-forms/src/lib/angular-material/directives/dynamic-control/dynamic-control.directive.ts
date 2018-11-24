import { ComponentFactoryResolver, Directive, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';

import { LoggerService } from 'utils';

const components = {
  input: DynamicInputComponent,
};

@Directive({
  selector: '[dynamicControl]'
})
export class DynamicControlDirective  implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;

  @Output() customEvent = new EventEmitter<any>();

  protected componentSubscriptions: Subscription[] = [];

  component: any;

  constructor(private resolver: ComponentFactoryResolver,
              private container: ViewContainerRef,
              private logger: LoggerService) {

  }

  ngOnInit() {

    // this.logger.info('DynamicControlDirective: ngOnInit()');

    this.createDynamicFormControlComponent();
  }

  private createDynamicFormControlComponent() {

    // this.logger.info('DynamicControlDirective: createDynamicFormControlComponent()');

    if (!components[this.model.type]) {

      const supportedTypes = Object.keys(components).join(', ');

      this.logger.info(`You tried to use an unsupported type (${this.model.type}). Supported types: ${supportedTypes}`);

    } else {

      const factory = this.resolver.resolveComponentFactory(components[this.model.type]);
      this.component = this.container.createComponent(factory);

      const instance = this.component.instance;

      instance.formGroup = this.formGroup;
      instance.model = this.model;

      if (instance.customEvent !== undefined) {

        this.logger.info('DynamicControlDirective: instance.customEvent.subscribe()');

        this.componentSubscriptions.push(
          instance.customEvent.subscribe(($event: any) => this.onCustomEvent($event)));
      }

    }

  }

  onCustomEvent($event: any): void {

    this.logger.info('DynamicControlDirective: onCustomEvent()');

    // const emitter = this.customEvent as EventEmitter<any>;
    // emitter.emit($event);
    this.customEvent.emit($event);
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
