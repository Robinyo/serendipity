import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { forkJoin } from 'rxjs';

import { ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import { ACCOUNTS_COLUMN_DEFS, CONTACTS_COLUMN_DEFS, RELATIONSHIP_LIST_COLUMN_DEFS } from './resolvers/constants';
import { ACCOUNT_INFORMATION_FORM, ADDRESS_FORM, CONTACT_DETAILS_FORM, CONTACT_INFORMATION_FORM, NAME_FORM } from './resolvers/form-ids';

import { contactResolver, contactsResolver } from './resolvers/resolvers';

export const partyRoutes: Routes = [
  {
    path: 'accounts',
    loadComponent: () => import('./features/accounts/accounts').then(m => m.Accounts),
    resolve: {
      metadata: () => {

        const configService: ConfigService = inject(ConfigService);
        const logger: LoggerService = inject(LoggerService);

        logger.info('Accounts Resolver');

        return configService.get(ACCOUNTS_COLUMN_DEFS);

      }
    }
  },
  {
    path: 'accounts/:id',
    loadComponent: () => import('./features/account/account').then(m => m.Account),
    resolve: {
      metadata: () => {

        const configService: ConfigService = inject(ConfigService);
        const formService: FormsService = inject(FormsService);
        const logger: LoggerService = inject(LoggerService);

        logger.info('Account Resolver');

        const relationshipListColumnDefs= configService.get(RELATIONSHIP_LIST_COLUMN_DEFS);

        //  @if (viewMode === 'card')
        const generalInformationFormDefs = formService.getFormMetadata(ACCOUNT_INFORMATION_FORM);

        return forkJoin({
          relationshipListColumDefs: relationshipListColumnDefs,
          generalInformationFormDefs: generalInformationFormDefs
        });

      }
    }
  },

  /*

  {
    path: 'new-contact',
    loadComponent: () => import('./features/contact-wizard/contact-wizard').then(m => m.ContactWizard),
    resolve: {
      metadata: () => {

        const formService: FormsService = inject(FormsService);
        const logger: LoggerService = inject(LoggerService);

        logger.info('Contact Wizard Resolver');

        const nameFormModel = formService.getFormMetadata(NAME_FORM);
        const addressFormModel = formService.getFormMetadata(ADDRESS_FORM);
        const contactDetailsFormModel = formService.getFormMetadata(CONTACT_DETAILS_FORM);

        return forkJoin({
          nameFormModel: nameFormModel,
          addressFormModel: addressFormModel,
          contactDetailsFormModel: contactDetailsFormModel
        });

      }
    }
  },

  */

  {
    path: 'contacts',
    loadComponent: () => import('./features/contacts/contacts').then(m => m.Contacts),
    resolve: { metadata: contactsResolver }
  },
  {
    path: 'contacts/:id',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact),
    resolve: { metadata: contactResolver }
  }
];
