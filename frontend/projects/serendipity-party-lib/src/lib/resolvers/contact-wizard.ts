import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, forkJoin } from 'rxjs';

import { DynamicFormService } from 'serendipity-dynamic-forms-lib';
import { LoggerService } from 'serendipity-utils-lib';

import {ADDRESS_FORM, CONTACT_DETAILS_FORM, NAME_FORM} from './form-ids';

@Injectable({
  providedIn: 'root'
})
export class ContactWizardResolver implements Resolve<any> {

  protected dynamicFormService: DynamicFormService = inject(DynamicFormService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Contact Wizard Resolver: resolve()');

    const nameFormModel = this.dynamicFormService.getFormMetadata(NAME_FORM);
    const addressFormModel = this.dynamicFormService.getFormMetadata(ADDRESS_FORM);
    const contactDetailsFormModel = this.dynamicFormService.getFormMetadata(CONTACT_DETAILS_FORM);

    return forkJoin({
      nameFormModel: nameFormModel,
      addressFormModel: addressFormModel,
      contactDetailsFormModel: contactDetailsFormModel
    });
  }

}

/*

@Injectable({
  providedIn: 'root'
})
export class ContactWizardResolver implements Resolve<any> {

  protected dynamicFormService: DynamicFormService = inject(DynamicFormService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Contact Wizard Resolver: resolve()');

    const generalInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_WIZARD_GENERAL_INFORMATION_GROUP);
    const addressInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_WIZARD_ADDRESS_INFORMATION_GROUP);

    return forkJoin({
      generalInformationFormDefs: generalInformationFormDefs,
      addressInformationFormDefs: addressInformationFormDefs
    });
  }

}

*/
