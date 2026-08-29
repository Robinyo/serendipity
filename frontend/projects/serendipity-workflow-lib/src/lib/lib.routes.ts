import { Routes } from '@angular/router';

import { activitiesResolver } from './resolvers/resolvers';

export const workflowRoutes: Routes = [

  {
    path: 'activities',
    loadComponent: () => import('./features/activities/activities').then(m => m.Activities),
    resolve: { metadata: activitiesResolver }
  },
  {
    path: 'activities/:id',
    loadComponent: () => import('./features/tasks/tasks').then(m => m.Tasks)
  }

];
