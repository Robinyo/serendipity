import { Route } from '@angular/router';

import { ContactsResolver } from './resolvers/contacts';

export const ContactRoute: Route = {
  path: 'customers/contacts/:id',
  loadComponent: () => import('./features/contact/contact').then(m => m.Contact)
};

export const ContactsRoute: Route = {
  path: 'customers/contacts',
  loadComponent: () => import('./features/contacts/contacts').then(m => m.Contacts),
  resolve: { columnDefs: ContactsResolver }
};



/*

import { Route } from '@angular/router';

import { Contacts } from './features/contacts/contacts';

export default [
  {
    path: 'customers/contacts',
    component: Contacts,
    resolve: { columnDefs: ContactsResolver }
  }
] satisfies Route[];

import { Routes } from '@angular/router';

export const SerendipityPartyLibRoutes: Routes = [

  {
    path: 'customers/contacts',
    loadComponent: () => import('./features/contacts/contacts').then(m => m.Contacts),
    resolve: { columnDefs: ContactsResolver }
  }

];

import { Route } from '@angular/router';

export const ContactsRoute: Route = {
  path: 'customers/contacts',
  loadComponent: () => import('./features/contacts/contacts').then(m => m.Contacts),
  resolve: { columnDefs: ContactsResolver }
};

*/
