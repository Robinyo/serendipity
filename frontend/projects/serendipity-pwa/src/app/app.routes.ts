import { Routes } from '@angular/router';

import { Placeholder } from 'serendipity-components-lib';
import { AccountsRoute, ContactRoute, ContactsRoute, NewContactRoute } from 'serendipity-party-lib';
import { ActivitiesRoute, TasksRoute } from 'serendipity-workflow-lib';

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

  AccountsRoute,

  ContactRoute,
  ContactsRoute,
  NewContactRoute,

  TasksRoute,

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
