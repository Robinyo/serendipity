import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//
// Utils lib
//

import { LoggerService } from 'utils';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class AuthModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Auth Module initialised');
  }

}

/*

// import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
// import { UtilsModule, LoggerService, loggerProviders } from 'utils';

  providers: [
    // { provide: LoggerService, useClass: ConsoleLoggerService }
    loggerProviders
  ],

*/
