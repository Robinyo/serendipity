import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, forkJoin } from 'rxjs';

import { DynamicFormService } from 'serendipity-dynamic-forms-lib';
import { LoggerService } from 'serendipity-utils-lib';

import { CONTACT_WIZARD_GENERAL_INFORMATION_GROUP, CONTACT_WIZARD_ADDRESS_INFORMATION_GROUP } from './form-ids';

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
