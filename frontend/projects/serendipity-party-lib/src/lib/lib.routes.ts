import { Routes } from '@angular/router';
import { accountResolver } from './resolvers/account.js';
import { accountsResolver } from './resolvers/accounts.js';
import { contactResolver } from './resolvers/contact.js';
import { contactsResolver } from './resolvers/contacts.js';
import { contactWizardResolver } from './resolvers/contact-wizard.js';

export const partyRoutes: Routes = [
  {
    path: 'accounts',
    loadComponent: () => import('./features/accounts/accounts.js').then(m => m.Accounts),
    resolve: { columnDefs: accountsResolver }
  },
  {
    path: 'accounts/:id',
    loadComponent: () => import('./features/account/account.js').then(m => m.Account),
    resolve: { metaData: accountResolver }
  },
  {
    path: 'new-contact',
    loadComponent: () => import('./features/contact-wizard/contact-wizard.js').then(m => m.ContactWizard),
    resolve: { metaData: contactWizardResolver }
  },
  {
    path: 'contacts/:id',
    loadComponent: () => import('./features/contact/contact.js').then(m => m.Contact),
    resolve: { metaData: contactResolver }
  },
  {
    path: 'contacts',
    loadComponent: () => import('./features/contacts/contacts.js').then(m => m.Contacts),
    resolve: { columnDefs: contactsResolver }
  }
];
