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

// https://stackoverflow.com/questions/39639098/using-a-directive-to-add-class-to-host-element

/*

  @HostBinding('class')
  elementClass = this.model.class;

[className]="model.class"



class="grid-column-2"

[class]="model.class"

  // tslint:disable-next-line:no-input-rename
  @Input('model') controlModel: DynamicFormControlModel;

            <mat-form-field appearance="outline" class="grid-column-1-span-2">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="displayName" placeholder="Full Name" autocomplete="name">
              <mat-hint></mat-hint>
            </mat-form-field>


<mat-form-field class="demo-full-width" [formGroup]="group">
  <input matInput [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType">
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
</mat-form-field>

*/
