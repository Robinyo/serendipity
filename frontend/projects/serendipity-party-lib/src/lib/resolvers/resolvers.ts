import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { forkJoin } from 'rxjs';

import { ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import { PartyService } from '../services/party/party';

import { CONTACTS_COLUMN_DEFS, RELATIONSHIP_LIST_COLUMN_DEFS } from './constants';
import { CONTACT_INFORMATION_FORM } from './form-ids';

const DEFAULT_LIMIT = 100; // Optimal bulk network chunk default size
const DEFAULT_ROWS_PER_PAGE = 10;

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

  const partyService = inject(PartyService);
  const configService = inject(ConfigService);

  const logger = inject(LoggerService);

  const filter = '';
  const offset = 0;
  const limit = DEFAULT_LIMIT;

  logger.info('Executing Contacts Resolver');

  return forkJoin({
    partySummary: partyService.findAllContacts(filter, offset, limit),
    columnDefs: configService.get(CONTACTS_COLUMN_DEFS),
  });

};

