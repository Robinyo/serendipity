import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-form',

  styleUrls: ['./dynamic-form.component.css'],
  template: `
    <form [formGroup]="formGroup">
      <ng-content></ng-content>
    </form>
  `
})
export class DynamicFormComponent implements OnInit {

  @Input()
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private logger: LoggerService) {

  }

  ngOnInit() {

    this.logger.info('DynamicFormComponent: ngOnInit()');
  }

}

/*

  templateUrl: './dynamic-form.component.html',

*/
