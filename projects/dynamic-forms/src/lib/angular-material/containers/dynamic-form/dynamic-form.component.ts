import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DynamicFormModel } from '../../models/dynamic-form.model';
import { DynamicFormControlCustomEvent } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Component({
  // encapsulation: ViewEncapsulation.None,
  selector: 'dynamic-form',
  template: `
    <form  [autocomplete]="autocomplete"
           [className]="className"
           [formGroup]="formGroup">

      <ng-container *ngFor="let controlModel of formModel;"
                    dynamicControl [formGroup]="formGroup"
                    [model]="controlModel"
                    (customEvent)="onCustomEvent($event)">
      </ng-container>

    </form>
  `,
  styleUrls: ['dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() formGroup: FormGroup;

  // tslint:disable-next-line:no-input-rename
  @Input('model') formModel: DynamicFormModel;

  @Input() autocomplete: string;
  @Input() className: string;

  @Output() customEvent = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder,
              private logger: LoggerService) {

  }

  public ngOnInit() {
    this.logger.info('DynamicFormComponent: ngOnInit()');
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('DynamicFormComponent: onCustomEvent()');
    this.customEvent.emit(event);
  }

}

/*

      (customEvent)="onEvent($event)">

      (customEvent)="onEvent($event)">


*/
