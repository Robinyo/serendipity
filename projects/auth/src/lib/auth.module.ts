import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule
  ],
  declarations: [],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: []
})
export class AuthModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Auth Module initialised');
  }

}
