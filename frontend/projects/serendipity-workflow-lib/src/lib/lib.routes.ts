import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { ACTIVITIES_COLUMN_DEFS } from './resolvers/constants.js'; // Ensure your constants are local values

export const workflowRoutes: Routes = [

  {
    path: 'activities',
    loadComponent: () => import('./features/activities/activities.js').then(m => m.Activities),
    resolve: {
      columnDefs: () => {
        const configService: ConfigService = inject(ConfigService);
        const logger: LoggerService = inject(LoggerService);
        logger.info('Workflow Activities Resolver');
        return configService.get(ACTIVITIES_COLUMN_DEFS);
      }
    }
  },
  {
    path: 'activities/:id',
    loadComponent: () => import('./features/tasks/tasks.js').then(m => m.Tasks)
  }

];



/*

import { Routes } from '@angular/router';

import { activitiesResolver } from './resolvers/activities.js';

export const workflowRoutes: Routes = [
  {
    path: 'activities',
    loadComponent: () => import('./features/activities/activities.js').then(m => m.Activities),
    resolve: { columnDefs: activitiesResolver }
  },
  {
    path: 'activities/:id',
    loadComponent: () => import('./features/tasks/tasks.js').then(m => m.Tasks)
  }
];


*/
