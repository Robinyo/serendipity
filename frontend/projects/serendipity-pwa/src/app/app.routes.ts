import { Routes } from '@angular/router';

import { authGuard } from 'serendipity-auth-lib';
import { Placeholder } from 'serendipity-components-lib';
import { Home } from './features/home/home';

export const routes: Routes = [

  // Public Route
  {
    path: '',
    component: Home
  },

  // Protected Block (Applies guard to everything inside)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'workflow', // 🔑 Base path maps cleanly to the single unified array handle
        loadChildren: () => import('serendipity-workflow-lib').then(m => m.workflowRoutes)
      },
      {
        path: 'customers/dashboards',
        component: Placeholder
      },
      {
        path: 'customers', // 🔑 Consolidates customer management under a shared layout handle
        loadChildren: () => import('serendipity-party-lib').then(m => m.partyRoutes)
      }
    ]
  },

  // Fallback Route (the Wildcard route)
  {
    path: '**',
    component: Placeholder
  }

];
