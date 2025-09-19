import { Routes } from '@angular/router';

import { Placeholder } from 'serendipity-components-lib';
import { ContactRoute, ContactsRoute } from 'serendipity-party-lib';
import { ActivitiesRoute } from 'serendipity-workflow-lib';

import { Home } from './features/home/home';

export const routes: Routes = [

  { path: '',
    component: Home
  },

  ActivitiesRoute,

  {
    path: 'customers/dashboards',
    component: Placeholder
  },


  ContactRoute,
  ContactsRoute,

  //
  // The Wildcard route
  // DO NOT insert routes after this one.
  // { path:'**', ...} needs to be the LAST one.
  //

  {
    path: '**',
    component: Placeholder
  }

];

/*

  import { ContactsResolver } from 'serendipity-party-lib';

  {
    path: 'customers/contacts',
    loadComponent: () => import('../../../serendipity-party-lib/src/lib/features/contacts/contacts').then(m => m.Contacts),
    resolve: { columnDefs: ContactsResolver }
  },

*/
