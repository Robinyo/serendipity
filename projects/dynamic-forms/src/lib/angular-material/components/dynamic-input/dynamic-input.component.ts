import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-input',
  template: `
    <mat-form-field [appearance]="model.appearance" [className]="model.class" [formGroup]="formGroup">
      <mat-label> {{ model.label }} </mat-label>
      <input matInput [autocomplete]="model.autocomplete" [formControlName]="model.id" [placeholder]="model.id">
      <mat-error *ngIf="formGroup.controls[model.id].invalid"> Error message </mat-error>
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

/*

<mat-form-field class="demo-full-width" [formGroup]="group">
<input matInput [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType">
<ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</mat-form-field>

      <ng-container *ngFor="let validator of model.validators;" ngProjectAs="mat-error">
        <mat-error *ngIf="formGroup.get(model.id).hasError(validator.name)"> {{ validator.message }} </mat-error>
      </ng-container>

*/
