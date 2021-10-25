import { NgModule } from '@angular/core';

import { LoggerService } from 'utils-lib';

@NgModule({
})
export class AuthLibModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Auth Library initialised');
  }

}
