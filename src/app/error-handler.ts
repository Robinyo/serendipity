import { ErrorHandler, Injectable } from '@angular/core';

import { LoggerService } from 'utils';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private logger: LoggerService) {

    this.logger.info('GlobalErrorHandler initialised');
  }

  handleError(error) {

    this.logger.info('GlobalErrorHandler: handleError()');

    this.logger.error(error);
  }
}
