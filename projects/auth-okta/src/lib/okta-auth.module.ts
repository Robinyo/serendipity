import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OktaConfig } from './models/models';
import { OktaConfigService } from './services/config.service';

import { AuthorizationCodeCallbackComponent } from './components/authorization-code/authorization-code.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';
import { ImplicitCallbackComponent } from './components/implicit-callback/implicit-callback.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,

    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [
    AuthorizationCodeCallbackComponent,
    LoginRedirectComponent,
    ImplicitCallbackComponent
  ]
})
export class OktaAuthModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Okta Auth Module initialised');
  }

  static forRoot(config: OktaConfig): ModuleWithProviders {

    return {
      ngModule: OktaAuthModule,
      providers: [
        { provide: OktaConfigService, useValue: config }
      ]
    };

  }

}
