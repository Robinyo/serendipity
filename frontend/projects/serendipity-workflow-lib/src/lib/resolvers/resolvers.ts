import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { forkJoin } from 'rxjs';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { WorkflowService } from '../services/workflow/workflow';

import { ACTIVITIES_COLUMN_DEFS } from './constants';

export const activitiesResolver = (route: ActivatedRouteSnapshot) => {

  const workflowService = inject(WorkflowService);
  const configService = inject(ConfigService);

  const logger = inject(LoggerService);

  const queryObject = {
    filter: {
      state: { $eq: "CREATED" }
    }
  };

  logger.info('Executing Activities Resolver');

  return forkJoin({
    activitiesSummary: workflowService.findAllActivities(queryObject),
    columnDefs: configService.get(ACTIVITIES_COLUMN_DEFS),
  });

};
