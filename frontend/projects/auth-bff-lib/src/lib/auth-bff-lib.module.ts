import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggerService } from 'utils-lib';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  exports: [
  ]
})
export class AuthBffLibModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Auth BFF Library initialised');
  }

}
