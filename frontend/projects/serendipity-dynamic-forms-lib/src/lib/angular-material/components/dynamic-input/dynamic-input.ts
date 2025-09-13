import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { LoggerService } from 'serendipity-utils-lib';

import { DynamicFormControlModel, DynamicFormControlCustomEvent } from '../../models/dynamic-form-control.model';

@Component({
  selector: 'dynamic-input',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field appearance="outline" [className]="model.gridItemClass">

      @if (model.label) {
        <mat-label> {{ model.label }} </mat-label>
      }

      @if (model.prefixIconName) {
        <mat-icon matPrefix> {{ model.prefixIconName }} </mat-icon>
      }

      <input [id]="model.id" matInput
             [autocomplete]="model.autocomplete"
             [placeholder]="model.placeholder"
             [readonly]="model.readonly"
             [required]="model.required"
             [type]="model.inputType"/>

      @if (model.suffixIconName) {
        <mat-icon matSuffix class="material-icons md-suffix-icon" (click)="iconSuffixClickHandler()"> {{ model.suffixIconName }} </mat-icon>
      }

      <!--
      <ng-container *ngFor="let validator of model.validators;" ngProjectAs="mat-error">
        <mat-error *ngIf="formGroup.controls[model.id].hasError(validator.propertyName)"> {{ validator.message }} </mat-error>
      </ng-container>
      -->

    </mat-form-field>
  `,
  styles: []
})
export class DynamicInput implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() model!: DynamicFormControlModel;

  @Output() customEvent = new EventEmitter<DynamicFormControlCustomEvent>();

  @HostBinding('class') elementClass: string | undefined;

  constructor(private logger: LoggerService) {

  }

  public ngOnInit() {

    // this.logger.info('Dynamic Input Component: ngOnInit()');

    this.elementClass = this.model.gridItemClass;
  }

  public iconSuffixClickHandler() {

    this.logger.info('Dynamic Input Component: emit customEvent');

    const suffixIconName = this.model.suffixIconName ? this.model.suffixIconName : '';

    this.customEvent.emit({ type: 'click', id: this.model.id, directive: 'matSuffix', name: suffixIconName});
  }

}
