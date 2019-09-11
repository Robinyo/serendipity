import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormControlCustomEvent, DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-input',
  template: `
    <mat-form-field [appearance]="model.appearance"
                    [className]="model.gridItemClass"
                    [formGroup]="formGroup">

      <ng-container *ngIf="model.label" ngProjectAs="mat-label">
        <mat-label> {{ model.label }} </mat-label>
      </ng-container>

      <span *ngIf="model.prefixIconName" matPrefix>
        <mat-icon matPrefix> {{ model.prefixIconName }} </mat-icon>
      </span>

      <input matInput
             [autocomplete]="model.autocomplete"
             [formControlName]="model.id"
             [placeholder]="model.placeholder"
             [required]="model.required"
             [type]="model.inputType"/>

      <span *ngIf="model.suffixIconName" matSuffix>
        <mat-icon matSuffix class="crm-suffix-icon" (click)="iconSuffixClickHandler()"> {{ model.suffixIconName }} </mat-icon>
      </span>

      <ng-container *ngFor="let validator of model.validators;" ngProjectAs="mat-error">
        <mat-error *ngIf="formGroup.controls[model.id].hasError(validator.propertyName)"> {{ validator.message }} </mat-error>
      </ng-container>

    </mat-form-field>
  `,
  styles: []
})
export class DynamicInputComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;

  @Output() customEvent = new EventEmitter<DynamicFormControlCustomEvent>();

  @HostBinding('class') elementClass;

  constructor(private logger: LoggerService) {

  }

  public ngOnInit() {

    // this.logger.info('DynamicInputComponent: ngOnInit()');
    this.elementClass = this.model.gridItemClass;
  }

  public iconSuffixClickHandler() {

    this.logger.info('DynamicInputComponent: emit customEvent');
    this.customEvent.emit({ type: 'click', id: this.model.id, directive: 'matSuffix', name: this.model.suffixIconName });
  }

}

// https://stackoverflow.com/questions/50574642/angular-material-mat-form-field-custom-component-matsuffix-in-ng-content
// https://stackoverflow.com/questions/31548311/angular-html-binding

// https://material.angular.io/components/form-field/overview
// https://material.angular.io/components/input/overview

// https://stackoverflow.com/questions/52612671/angular-material-2-reactive-forms-mat-error-with-ngif-not-showing-when-valid
// https://stackoverflow.com/questions/46129719/angular-4-form-validators-minlength-maxlength-does-not-work-on-field-type-nu/46129969
// https://github.com/angular/angular/issues/7407

/*

ERROR: projects/dynamic-forms/src/lib/angular-material/components/dynamic-input/dynamic-input.component.ts(11,21): Type 'string'
 is not assignable to type 'MatFormFieldAppearance'.

    <mat-form-field [appearance]="model.appearance"

*/

/*

      <span matPrefix>
        <ng-container *ngIf="model.prefixIconName" ngProjectAs="mat-icon">
          <mat-icon matPrefix> {{ model.prefixIconName }} </mat-icon>
        </ng-container>
      </span>

      <span matSuffix>
        <ng-container *ngIf="model.suffixIconName" ngProjectAs="mat-icon">
          <mat-icon matSuffix class="crm-suffix-icon" (click)="iconSuffixClickHandler()"> {{ model.suffixIconName }} </mat-icon>
        </ng-container>
      </span>

*/

/*

  @HostListener(`document:cat`, ['$event'])
  public onEvent(event: any) {
    this.logger.info('DynamicInputComponent: iconSuffixClickHandler()');
  }

      <mat-icon matSuffix> search </mat-icon>

      <span *ngIf="model.suffix">
        <mat-icon matSuffix> {{ model.suffix }} </mat-icon>
      </span>

      <ng-container *ngIf="model.suffix" ngProjectAs="mat-icon">
        <mat-icon matSuffix>model.suffix</mat-icon>
      </ng-container>

      <span *ngIf="model.prefix" matPrefix [innerHTML]="model.prefix"></span>

      <span *ngIf="model.suffix" matSuffix [innerHTML]="model.suffix"></span>

*/
