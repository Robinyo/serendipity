import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-input',
  template: `
    <mat-form-field [appearance]="model.appearance"
                    [className]="model.class"
                    [formGroup]="formGroup">

      <mat-label> {{ model.label }} </mat-label>
      <input matInput
             [autocomplete]="model.autocomplete"
             [formControlName]="model.id"
             [placeholder]="model.label"
             [required]="model?.required" />

      <ng-container *ngFor="let validator of model.validators;" ngProjectAs="mat-error">
        <mat-error *ngIf="formGroup.controls[model.id].hasError(validator.propertyName)"> {{ validator.message }} </mat-error>
      </ng-container>

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

// [hideRequiredMarker]="model.hideRequiredMarker">

// https://material.angular.io/components/form-field/overview
// https://material.angular.io/components/input/overview

// https://stackoverflow.com/questions/52612671/angular-material-2-reactive-forms-mat-error-with-ngif-not-showing-when-valid
// https://stackoverflow.com/questions/46129719/angular-4-form-validators-minlength-maxlength-does-not-work-on-field-type-nu/46129969
// https://github.com/angular/angular/issues/7407
