import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-input',
  template: `
    <mat-form-field [appearance]="model.appearance" [className]="model.class" [formGroup]="formGroup">
      <mat-label> {{ model.label }} </mat-label>
      <input matInput [autocomplete]="model.autocomplete" [formControlName]="model.id" [placeholder]="model.id" >
      <mat-hint></mat-hint>
    </mat-form-field>
  `,
  styles: []
})
export class DynamicInputComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;

  @HostBinding('class') elementClass;

  constructor(private logger: LoggerService) {

  }

  ngOnInit() {

    this.logger.info('DynamicInputComponent: ngOnInit()');
    this.elementClass = this.model.class;
  }

}
