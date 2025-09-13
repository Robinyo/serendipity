import { Component, HostBinding, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LoggerService } from 'serendipity-utils-lib';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

@Component({
  selector: 'dynamic-image',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <img [src]="formGroup.controls[model.id].value" [alt]="model.label">
  `,
})
export class DynamicImage implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() model!: DynamicFormControlModel;

  @HostBinding('class') elementClass: string | undefined;

  protected logger: LoggerService = inject(LoggerService);

  public ngOnInit() {

    // this.logger.info('Dynamic Image Component: ngOnInit()');

    this.elementClass = this.model.gridItemClass;
  }

}
