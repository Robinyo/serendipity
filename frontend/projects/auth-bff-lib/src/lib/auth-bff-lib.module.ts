import { NgModule } from '@angular/core';

import { LoggerService } from 'utils-lib';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
  ]
})
export class AuthBffLibModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Auth BFF Library initialised');
  }

}
