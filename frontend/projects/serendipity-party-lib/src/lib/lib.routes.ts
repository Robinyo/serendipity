import { Routes } from '@angular/router';

import { accountsResolver, accountResolver, contactResolver, contactsResolver } from './resolvers/resolvers';
import { canDeactivateGuard } from './guards/can-deactivate';

export const partyRoutes: Routes = [

  {
    path: 'accounts',
    loadComponent: () => import('./features/accounts/accounts').then(m => m.Accounts),
    resolve: { metadata: accountsResolver }
  },
  {
    path: 'accounts/:id',
    loadComponent: () => import('./features/account/account').then(m => m.Account),
    resolve: { metadata: accountResolver },
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: 'contacts',
    loadComponent: () => import('./features/contacts/contacts').then(m => m.Contacts),
    resolve: { metadata: contactsResolver }
  },
  {
    path: 'contacts/:id',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact),
    resolve: { metadata: contactResolver },
    canDeactivate: [canDeactivateGuard]
  }

];
