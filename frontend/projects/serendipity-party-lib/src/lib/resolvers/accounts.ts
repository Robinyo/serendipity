import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { ACCOUNTS_COLUMN_DEFS } from './constants.js';

export const accountsResolver: ResolveFn<any> = (route, state) => {

  const configService:ConfigService = inject(ConfigService);
  const logger:LoggerService = inject(LoggerService);

  logger.info('Accounts Resolver');

  return configService.get(ACCOUNTS_COLUMN_DEFS);

};
