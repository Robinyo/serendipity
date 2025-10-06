import { Component, HostBinding, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { LoggerService } from 'serendipity-utils-lib';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

@Component({
  selector: 'dynamic-datepicker',
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field
      appearance="outline"
      [className]="model.gridItemClass"
      [formGroup]="formGroup">

      @if (model.label) {
        <mat-label> {{ model.label }} </mat-label>
      }

      <input [id]="model.id" matInput
             [matDatepicker]="picker"
             [placeholder]="model.placeholder"
             [required]="model.required" />

      <mat-icon matSuffix class="material-icons md-suffix-icon" (click)="picker.open()"> event </mat-icon>

      <mat-datepicker #picker></mat-datepicker>

      <!--
      <ng-container *ngFor="let validator of model.validators;" ngProjectAs="mat-error">
        <mat-error *ngIf="formGroup.controls[model.id].hasError(validator.propertyName)"> {{ validator.message }} </mat-error>
      </ng-container>
      -->

    </mat-form-field>
  `,
})
export class DynamicDatepicker implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() model!: DynamicFormControlModel;

  @HostBinding('class') elementClass: string | undefined;

  protected logger: LoggerService = inject(LoggerService);

  public ngOnInit() {

    // this.logger.info('Dynamic Datepicker Component: ngOnInit()');

    this.elementClass = this.model.gridItemClass;
  }

}
