import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DynamicFormModel } from '../../models/dynamic-form.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-form',
  template: `
    <form [formGroup]="formGroup" [className]="className">
      <ng-container *ngFor="let controlModel of formModel;" dynamicControl [formGroup]="formGroup" [model]="controlModel">
      </ng-container>
    </form>
  `,
  styles: []
})
export class DynamicFormComponent implements OnInit {

  @Input() formGroup: FormGroup;

  // tslint:disable-next-line:no-input-rename
  @Input('model') formModel: DynamicFormModel;

  @Input() className: string;

  constructor(private formBuilder: FormBuilder,
              private logger: LoggerService) {

  }

  ngOnInit() {

    this.logger.info('DynamicFormComponent: ngOnInit()');
  }

}

/*

    <form [formGroup]="formGroup" [className]="className">
      <ng-content></ng-content>
    </form>


*/
