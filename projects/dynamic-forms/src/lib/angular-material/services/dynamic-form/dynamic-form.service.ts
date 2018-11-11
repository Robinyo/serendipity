import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { DynamicFormsConfig } from '../../../shared/models';
import { DynamicFormsConfigService } from '../../../services/config.service';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';
import { DynamicFormModel } from '../../models/dynamic-form.model';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  private url = 'assets/data/forms/';

  constructor(@Inject(DynamicFormsConfigService) private config: DynamicFormsConfig,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private logger: LoggerService) {

    this.url = this.url + this.config.defaultLanguage + '/';

    this.logger.info('DynamicFormService: url: ' + this.url);
  }

  public getFormMetadata(filename: string): Observable<DynamicFormControlModel[]> {
    return this.httpClient.get<DynamicFormControlModel[]>(this.url + filename);
  }

  // https://angular.io/api/forms/FormControl

  public createFormGroup(formModel: DynamicFormModel): FormGroup {

    const group = this.formBuilder.group({});

    this.logger.info('DynamicFormService: createFormGroup()');

    formModel.forEach(control => {
      group.addControl(control.id, new FormControl(''));
    });

    return group;
  }

  public initFormGroup(formGroup: FormGroup, item): void {

    this.logger.info('DynamicFormService: initialiseForm()');

    for (const field of Object.keys(formGroup.controls)) {

      const property = this.getProperty(item, field);

      if (typeof property !== 'undefined') {
        // this.logger.info('property: ' + property);
        formGroup.controls[field].setValue(property);
      }

    }

  }

  getProperty = (obj, path) => (
    path.split('-').reduce((o, p) => o && o[p], obj)
  )

}

/*

      // this.logger.info('field name: ' + field +
      //   ' nested object name: ' + field.replace('-', '.') +
      //   ' value: ' + this.getProperty(this.item, field));

*/
