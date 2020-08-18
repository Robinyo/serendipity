import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
