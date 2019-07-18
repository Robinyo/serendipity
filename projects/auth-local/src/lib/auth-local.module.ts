import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { LoginComponent } from './components/login/login.component';

//
// Auth lib
//

import { AuthModule } from 'auth';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// Utils lib
//

// import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { UtilsModule, LoggerService, loggerProviders } from 'utils';
import { AngularMaterialModule } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    AuthModule,
    CommonModule,
    DynamicFormsModule,
    FlexLayoutModule,
    UtilsModule
  ],
  declarations: [ LoginComponent ],
  providers: [
    // { provide: LoggerService, useClass: ConsoleLoggerService }
    loggerProviders
  ],
  exports: [ LoginComponent ]
})
export class AuthLocalModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Auth Local Module initialised');
  }

}
