import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { forkJoin } from 'rxjs';

import { ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import { RELATIONSHIP_LIST_COLUMN_DEFS } from './constants.js';
import { ACCOUNT_INFORMATION_FORM } from './form-ids.js';

export const accountResolver: ResolveFn<any> = (route, state) => {

  const configService: ConfigService = inject(ConfigService);
  const dynamicFormService: FormsService = inject(FormsService);
  const logger: LoggerService = inject(LoggerService);

  logger.info('Account Resolver');

  const relationshipListColumnDefs= configService.get(RELATIONSHIP_LIST_COLUMN_DEFS);

  //  @if (viewMode === 'card')
  const generalInformationFormDefs = dynamicFormService.getFormMetadata(ACCOUNT_INFORMATION_FORM);

  return forkJoin({
    relationshipListColumDefs: relationshipListColumnDefs,
    generalInformationFormDefs: generalInformationFormDefs
  });

};
