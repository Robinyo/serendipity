import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils-lib';

@Component({
  selector: 'dynamic-label',
  template: `
    <mat-label> {{ model.label }} </mat-label>
  `,
  styles: [],
})
export class DynamicLabelComponent implements OnInit {

  @Input() formGroup!: FormGroup;
  @Input() model!: DynamicFormControlModel;

  @HostBinding('class') elementClass: string | undefined;

  constructor(private logger: LoggerService) {

  }

  public ngOnInit() {

    this.elementClass = this.model.gridItemClass;
  }

}
