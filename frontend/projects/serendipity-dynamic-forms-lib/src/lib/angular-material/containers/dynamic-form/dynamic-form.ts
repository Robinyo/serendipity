import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LoggerService } from 'serendipity-utils-lib';

import { DynamicControlDirective } from '../../directives/dynamic-control/dynamic-control';
import { DynamicFormModel } from '../../models/dynamic-form.model';
import { DynamicFormControlCustomEvent } from '../../models/dynamic-form-control.model';

@Component({
  selector: 'dynamic-form',
  imports: [
    // CommonModule,
    ReactiveFormsModule,
    DynamicControlDirective
  ],
  template: `
    <form  [autocomplete]="autocomplete"
           [className]="className"
           [formGroup]="formGroup">

      <!--

      <ng-container *ngFor="let controlModel of formModel;"
                    dynamicControl [formGroup]="formGroup"
                    [model]="controlModel"
                    (customEvent)="onCustomEvent($event)">
      </ng-container>

      -->

      @for (controlModel of formModel; track $index) {

        <ng-container dynamicControl [formGroup]="formGroup"
                      [model]="controlModel"
                      (customEvent)="onCustomEvent($event)">
        </ng-container>
      }

    </form>
  `
})
export class DynamicForm implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input('model') formModel!: DynamicFormModel;

  @Input() autocomplete!: string;
  @Input() className!: string;

  @Output() customEvent = new EventEmitter<any>();

  // private formBuilder: FormBuilder = inject(FormBuilder);
  private logger: LoggerService = inject(LoggerService);

  public ngOnInit() {
    this.logger.info('Dynamic Form Component: ngOnInit()');
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('Dynamic Form Component: onCustomEvent()');

    this.customEvent.emit(event);
  }

}
