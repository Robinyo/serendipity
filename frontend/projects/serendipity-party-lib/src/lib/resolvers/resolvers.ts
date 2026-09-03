import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { forkJoin } from 'rxjs';

import { CATALOG_CONFIG_TOKEN, ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import { PartyService } from '../services/party/party';
import { AccountsService } from '../services/accounts/accounts';

import { ACCOUNTS_COLUMN_DEFS, CONTACTS_COLUMN_DEFS, RELATIONSHIP_LIST_COLUMN_DEFS } from './constants';
import { ACCOUNT_INFORMATION_FORM, CONTACT_INFORMATION_FORM} from './form-ids';

export const accountsResolver = (route: ActivatedRouteSnapshot) => {

  const globalConfig = inject(CATALOG_CONFIG_TOKEN);

  const accountsService = inject(AccountsService);
  const configService = inject(ConfigService);

  const logger = inject(LoggerService);

  logger.info('Executing Accounts Resolver');

  return forkJoin({
    accounts: accountsService.find('', 0, globalConfig.defaultLimit),
    columnDefs: configService.get(ACCOUNTS_COLUMN_DEFS),
  });

};

export const accountResolver = (route: ActivatedRouteSnapshot) => {

  const accountsService = inject(AccountsService);
  const configService = inject(ConfigService);
  const formService = inject(FormsService);

  const logger = inject(LoggerService);

  const id = route.paramMap.get('id')!;

  logger.info(`Executing Account Resolver for Id: ${id}`);

  return forkJoin({
    account: accountsService.findById(id),
    relationshipListColumnDefs: configService.get(RELATIONSHIP_LIST_COLUMN_DEFS),
    generalInformationFormSchema: formService.getFormMetadata(ACCOUNT_INFORMATION_FORM)
  });

};

export const contactsResolver = (route: ActivatedRouteSnapshot) => {

  const globalConfig = inject(CATALOG_CONFIG_TOKEN);

  const partyService = inject(PartyService);
  const configService = inject(ConfigService);

  const logger = inject(LoggerService);

  logger.info('Executing Contacts Resolver');

  return forkJoin({
    contacts: partyService.findAllContacts('', 0, globalConfig.defaultLimit),
    columnDefs: configService.get(CONTACTS_COLUMN_DEFS),
  });

};

export const contactResolver = (route: ActivatedRouteSnapshot) => {

  const partyService = inject(PartyService);
  const configService = inject(ConfigService);
  const formService = inject(FormsService);

  const logger = inject(LoggerService);

  const id = route.paramMap.get('id')!;

  logger.info(`Executing Contact Resolver for Id: ${id}`);

  return forkJoin({
    contact: partyService.findContactById(id),
    relationshipListColumnDefs: configService.get(RELATIONSHIP_LIST_COLUMN_DEFS),
    generalInformationFormSchema: formService.getFormMetadata(CONTACT_INFORMATION_FORM)
  });

};
