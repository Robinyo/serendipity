import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { CONTACTS_COLUMN_DEFS } from './constants.js';

export const contactsResolver: ResolveFn<any> = (route, state) => {

  const configService: ConfigService = inject(ConfigService);
  const logger: LoggerService = inject(LoggerService);

  logger.info('Contacts Resolver');

  return configService.get(CONTACTS_COLUMN_DEFS);

};
