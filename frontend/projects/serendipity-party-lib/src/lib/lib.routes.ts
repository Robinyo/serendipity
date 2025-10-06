import { Route } from '@angular/router';

import { AccountsResolver } from './resolvers/accounts';

import { ContactResolver } from './resolvers/contact';
import { ContactsResolver } from './resolvers/contacts';

export const AccountsRoute: Route = {
  path: 'customers/accounts',
  loadComponent: () => import('./features/accounts/accounts').then(m => m.Accounts),
  resolve: { columnDefs: AccountsResolver }
};

export const ContactRoute: Route = {
  path: 'customers/contacts/:id',
  loadComponent: () => import('./features/contact/contact').then(m => m.Contact),
  resolve: { metaData: ContactResolver }
};

export const ContactsRoute: Route = {
  path: 'customers/contacts',
  loadComponent: () => import('./features/contacts/contacts').then(m => m.Contacts),
  resolve: { columnDefs: ContactsResolver }
};
