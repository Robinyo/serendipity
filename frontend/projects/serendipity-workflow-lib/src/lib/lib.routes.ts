import { Route } from '@angular/router';

import { ActivitiesResolver } from './resolvers/activities';

export const ActivitiesRoute: Route = {
  path: 'workflow/activities',
  loadComponent: () => import('./features/activities/activities').then(m => m.Activities),
  resolve: { columnDefs: ActivitiesResolver }
};

export const TasksRoute: Route = {
  path: 'workflow/activities/:id',
  loadComponent: () => import('./features/tasks/tasks').then(m => m.Tasks)
};
