import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DynamicFormModel } from '../../models/dynamic-form.model';

import { LoggerService } from 'utils';

@Component({
  // encapsulation: ViewEncapsulation.None,
  selector: 'dynamic-form',
  template: `
    <form  [autocomplete]="autocomplete" [className]="className" [formGroup]="formGroup">
      <ng-container *ngFor="let controlModel of formModel;"
                    dynamicControl [formGroup]="formGroup"
                    [model]="controlModel">
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

  constructor(private formBuilder: FormBuilder,
              private logger: LoggerService) {

  }

  ngOnInit() {

    this.logger.info('DynamicFormComponent: ngOnInit()');
  }

}
