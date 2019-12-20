import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-label',
  template: `
    <mat-label> {{ model.label }} </mat-label>
  `,
  styles: [],
})
export class DynamicLabelComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;

  @HostBinding('class') elementClass;

  constructor(private logger: LoggerService) {

  }

  public ngOnInit() {

    this.elementClass = this.model.gridItemClass;
  }

}

/*

    // N.B. mat-form-field requires a control

    <mat-form-field [appearance]="model.appearance"
                    [className]="model.gridItemClass"
                    [formGroup]="formGroup">

      <mat-label> {{ model.label }} </mat-label>

    </mat-form-field>

*/

/*

  template: `
    <div class="form-field-label">
      <mat-label> {{ model.label }} </mat-label>
    </div>
  `,
  styles: [`
    .form-field-label {
      align-self: center;
    }
  `],

*/
