import { Component, HostBinding, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import { LoggerService } from 'serendipity-utils-lib';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

@Component({
  selector: 'dynamic-label',
  imports: [
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-label> {{ model.label }}</mat-label>
  `,
})
export class DynamicLabel implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() model!: DynamicFormControlModel;

  @HostBinding('class') elementClass: string | undefined;

  protected logger: LoggerService = inject(LoggerService);

  public ngOnInit() {

    // this.logger.info('Dynamic Label Component: ngOnInit()');

    this.elementClass = this.model.gridItemClass;
  }

}
