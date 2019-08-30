import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DynamicFormsModule,
    FlexLayoutModule,
    UtilsModule,

    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ LoginComponent, RegisterComponent ],
  exports: [ LoginComponent, RegisterComponent ]
})
export class LocalAuthModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Local Auth Module initialised');
  }

}
