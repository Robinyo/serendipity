import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggerService, UtilsLibModule } from 'utils-lib';

@NgModule({
  imports: [
    CommonModule,
    UtilsLibModule
  ]
})
export class AuthBffLibModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Auth BFF Library initialised');
  }

}
