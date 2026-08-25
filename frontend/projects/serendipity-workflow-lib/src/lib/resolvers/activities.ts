import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { ACTIVITIES_COLUMN_DEFS } from './constants.js';

export const activitiesResolver: ResolveFn<any> = (route, state) => {

  const configService: ConfigService = inject(ConfigService);
  const logger: LoggerService = inject(LoggerService);

  logger.info('Activities Resolver');

  return configService.get(ACTIVITIES_COLUMN_DEFS);

};
