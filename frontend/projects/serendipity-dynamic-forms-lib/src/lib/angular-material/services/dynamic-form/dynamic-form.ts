import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';

import { environment, HttpOptions, LoggerService } from 'serendipity-utils-lib';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';
import { DynamicFormModel } from '../../models/dynamic-form.model';
import { ValidatorModel } from '../../models/validator.model';

export type ValidatorFactory = (args: any) => ValidatorFn;

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  protected formBuilder: FormBuilder = inject(FormBuilder);
  protected httpClient = inject(HttpClient);
  protected logger: LoggerService = inject(LoggerService);

  private uriPrefix = 'assets/data/forms/';
  private uriSuffix = '.json';

  public getFormMetadata(formId: string): Observable<any> {
    return this.httpClient.get<any>(this.uriPrefix + formId + this.uriSuffix);
  }

  public createGroup(formModel: DynamicFormModel): FormGroup {

    const group = this.formBuilder.group({});

    this.logger.info('Dynamic Form Service: createGroup()');

    formModel.forEach(controlModel => {

      const name = controlModel.id ? controlModel.id : controlModel.name;

      group.addControl(name, this.createControl(controlModel));
    });

    return group;
  }

  public createControl(controlModel: DynamicFormControlModel) {
    return this.formBuilder.control('', this.getValidators(controlModel.validators || []) );
  }

  public getValidators(validatorModel: ValidatorModel[]) {

    if (validatorModel.length === 0) {
      return null;
    }

    let validatorFn: ValidatorFn | undefined;
    const functions: ValidatorFn[] = [];

    validatorModel.forEach(validator => {

      validatorFn = this.getValidatorFn(validator.name, validator.args);

      if (validatorFn) {
        functions.push(validatorFn);
      }

    });

    return Validators.compose(functions);

  }

  public getValidatorFn(validatorName: string, validatorArgs: any): ValidatorFn | undefined {

    let validatorFn: ValidatorFn;

    if (Validators.hasOwnProperty(validatorName) ) {

      validatorFn = (Validators as any)[validatorName];

      if (validatorArgs !== null) {
        validatorFn = (validatorFn as ValidatorFactory)(validatorArgs);
      }

      return validatorFn;

    }

    return undefined;

  }

  public initGroup(formGroup: FormGroup, item: any): void {

    this.logger.info('Dynamic Form Service: initGroup()');

    for (const field of Object.keys(formGroup.controls)) {

      const property = this.getProperty(item, field);

      // formGroup.controls[field] type === ???

      if (typeof property !== 'undefined') {

        // this.logger.info('field: ' + field + ' value: ' + formGroup.controls[field].value);
        // this.logger.info('field: ' + field + ' property: ' + property);

        formGroup.controls[field].setValue(property);

        // this.logger.info('field: ' + field + ' value: ' + formGroup.controls[field].value);

      }

    }

  }

  public value(formGroup: FormGroup, item: any): void {

    this.logger.info('DynamicFormService: value()');

    for (const field of Object.keys(formGroup.controls)) {

      this.logger.info('field: ' + field);

      // embeddedObject, for example party.displayName
      const embeddedObject = field.split('.');

      switch (embeddedObject.length) {

        case 1:

          item[field] = formGroup.controls[field].value;
          break;

        case 2:

          // const iterator = embeddedObject.values();

          // for (const element of iterator) {
          //   this.logger.info('element: ' + element);
          // }

          // this.logger.info(embeddedObject[0] + ': ' + JSON.stringify(item[embeddedObject[0]]));
          // this.logger.info(embeddedObject[1] + ': ' + item[embeddedObject[0]][embeddedObject[1]]);

          item[embeddedObject[0]][embeddedObject[1]] = formGroup.controls[field].value;
          break;

        default:

          this.logger.error('DynamicFormService: Invalid embedded object depth');
          break;

      }

    }

  }

  private getProperty = (obj: any, path: any) => (
    path.split('.').reduce((o: any, p: any) => o && o[p], obj)
  )

}
