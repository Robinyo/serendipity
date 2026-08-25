import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { forkJoin } from 'rxjs';

import { ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import {ADDRESS_FORM, CONTACT_DETAILS_FORM, NAME_FORM} from './form-ids.js';

export const contactWizardResolver: ResolveFn<any> = (route, state) => {

  const configService: ConfigService = inject(ConfigService);
  const dynamicFormService: FormsService = inject(FormsService);
  const logger: LoggerService = inject(LoggerService);

  logger.info('Contact Wizard Resolver');

  const nameFormModel = dynamicFormService.getFormMetadata(NAME_FORM);
  const addressFormModel = dynamicFormService.getFormMetadata(ADDRESS_FORM);
  const contactDetailsFormModel = dynamicFormService.getFormMetadata(CONTACT_DETAILS_FORM);

  return forkJoin({
    nameFormModel: nameFormModel,
    addressFormModel: addressFormModel,
    contactDetailsFormModel: contactDetailsFormModel
  });

};
