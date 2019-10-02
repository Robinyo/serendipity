import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

//
// Serendipity Components lib
//

import { SerendipityComponentsModule } from 'serendipity-components';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

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
    SerendipityComponentsModule,
    TranslateModule.forChild(),
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
