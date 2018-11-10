import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';

import { FormGroup } from '@angular/forms';

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

  component: any;

  constructor(private resolver: ComponentFactoryResolver,
              private container: ViewContainerRef,
              private logger: LoggerService) {

  }

  ngOnInit() {

    // this.logger.info('DynamicControlDirective: ngOnInit()');

    if (!components[this.model.type]) {

      const supportedTypes = Object.keys(components).join(', ');

      this.logger.info(`You tried to use an unsupported type (${this.model.type}). Supported types: ${supportedTypes}`);

    } else {

      const factory = this.resolver.resolveComponentFactory(components[this.model.type]);
      this.component = this.container.createComponent(factory);
      this.component.instance.formGroup = this.formGroup;
      this.component.instance.model = this.model;
    }

  }

}
