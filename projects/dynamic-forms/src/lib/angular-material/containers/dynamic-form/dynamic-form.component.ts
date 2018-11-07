import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DynamicFormModel } from '../../models/dynamic-form.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-form',

  styleUrls: ['./dynamic-form.component.css'],
  template: `
    <form [formGroup]="formGroup" [className]="className">
      <ng-content></ng-content>
    </form>
  `
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
