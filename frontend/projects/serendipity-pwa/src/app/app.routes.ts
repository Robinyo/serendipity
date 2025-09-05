import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Placeholder } from './features/placeholder/placeholder';

// import { Contacts } from 'serendipity-party-lib';

export const routes: Routes = [

  { path: '',
    component: Home
  },

  {
    path: 'work/activities',
    component: Placeholder,
  },

  {
    path: 'customers/dashboards',
    component: Placeholder,
  },

  {
    path: 'customers/contacts',
    loadComponent: () => import('../../../serendipity-party-lib/src/lib/features/contacts/contacts').then(m => m.Contacts)
  }

];
