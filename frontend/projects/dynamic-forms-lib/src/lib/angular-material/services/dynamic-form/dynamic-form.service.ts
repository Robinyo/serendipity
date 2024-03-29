import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { Config, EnvironmentService, HttpOptions, LoggerService } from "utils-lib";

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';
import { DynamicFormModel } from '../../models/dynamic-form.model';
import { ValidatorModel } from '../../models/validator.model';

import { DynamicFormsLibModule } from '../../../dynamic-forms-lib.module';

// https://github.com/udos86/ng-dynamic-forms/blob/master/packages/core/src/service/dynamic-form-validation.service.ts

// export type Validator = ValidatorFn | AsyncValidatorFn;
// export type ValidatorFactory = (args: any) => Validator;

export type ValidatorFactory = (args: any) => ValidatorFn;

@Injectable({
  // providedIn: 'root'
  providedIn: DynamicFormsLibModule
})
export class DynamicFormService {

  private uriPrefix = 'assets/data/forms/';
  private uriSuffix = '.json';

  private config: Config;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private environmentService: EnvironmentService,
              private logger: LoggerService) {

    this.config = this.environmentService.getConfig();

    // this.uriPrefix = this.uriPrefix + this.config.defaultLanguage.split('-')[0] + '/';

    this.logger.info('DynamicFormService: uriPrefrix: ' + this.uriPrefix);
  }

  public getFormMetadata(formId: string): Promise<DynamicFormControlModel[]> {
    // @ts-ignore
    return this.httpClient.get<DynamicFormControlModel[]>(this.uriPrefix + formId + this.uriSuffix).toPromise();
  }

  // https://angular.io/api/forms/FormControl

  public createGroup(formModel: DynamicFormModel): FormGroup {

    const group = this.formBuilder.group({});

    this.logger.info('DynamicFormService: createGroup()');

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

    //
    // Built-in validators: https://angular.io/guide/form-validation#built-in-validators
    //

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

    this.logger.info('DynamicFormService: initGroup()');

    for (const field of Object.keys(formGroup.controls)) {

      const property = this.getProperty(item, field);

      // formGroup.controls[field] type === ???

      if (typeof property !== 'undefined') {
        formGroup.controls[field].setValue(property);
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

// public getFormMetadata(formId: string): Observable<DynamicFormControlModel[]> {
//   return this.httpClient.get<DynamicFormControlModel[]>(this.uriPrefix + formId + this.uriSuffix);
// }

// https://github.com/toddmotto/angular-dynamic-forms/blob/master/app/dynamic-form/containers/dynamic-form/dynamic-form.component.ts

// https://github.com/bahurudeen/dynamicform/blob/master/src/app/components/dynamic-form/dynamic-form.component.ts

// https://github.com/udos86/ng-dynamic-forms/blob/master/packages/core/src/service/dynamic-form.service.ts
// https://github.com/udos86/ng-dynamic-forms/blob/master/packages/core/src/service/dynamic-form-validation.service.ts

// return new FormControl('');
// const { disabled, validation, value } = config;
// return this.fb.control({ disabled, value }, validation);
