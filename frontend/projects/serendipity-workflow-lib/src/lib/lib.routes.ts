import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { ACTIVITIES_COLUMN_DEFS } from './constants';

export const workflowRoutes: Routes = [

  {
    path: 'activities',
    loadComponent: () => import('./features/activities/activities').then(m => m.Activities),
    resolve: {
      metadata: () => {
        const configService: ConfigService = inject(ConfigService);
        const logger: LoggerService = inject(LoggerService);
        logger.info('Activities Resolver');
        return configService.get(ACTIVITIES_COLUMN_DEFS);
      }
    }
  },
  {
    path: 'activities/:id',
    loadComponent: () => import('./features/tasks/tasks').then(m => m.Tasks)
  }

];
