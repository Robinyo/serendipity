import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CATALOG_CONFIG_TOKEN, ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import { PartyService } from '../services/party/party';

import { CONTACTS_COLUMN_DEFS, RELATIONSHIP_LIST_COLUMN_DEFS } from './constants';
import { CONTACT_INFORMATION_FORM } from './form-ids';

export const contactResolver = (route: ActivatedRouteSnapshot) => {

  const partyService = inject(PartyService);
  const configService = inject(ConfigService);
  const formService = inject(FormsService);

  const logger = inject(LoggerService);

  const id = route.paramMap.get('id')!;

  logger.info(`Executing Contact Resolver for Id: ${id}`);

  return forkJoin({
    party: partyService.findContactById(id),
    relationshipListColumnDefs: configService.get(RELATIONSHIP_LIST_COLUMN_DEFS),
    generalInformationFormSchema: formService.getFormMetadata(CONTACT_INFORMATION_FORM)
  });

};

export const contactsResolver = (route: ActivatedRouteSnapshot) => {

  const globalConfig = inject(CATALOG_CONFIG_TOKEN);

  const partyService = inject(PartyService);
  const configService = inject(ConfigService);

  const logger = inject(LoggerService);

  logger.info('Executing Contacts Resolver');

  return forkJoin({
    partySummary: partyService.findAllContacts('', 0, globalConfig.defaultLimit),
    columnDefs: configService.get(CONTACTS_COLUMN_DEFS),
  });

};

