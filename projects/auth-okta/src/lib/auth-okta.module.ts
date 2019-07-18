import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { AuthOktaConfig } from './models/models';
import { AuthOktaConfigService } from './services/config.service';

import { LoginComponent } from './components/login/login.component';

//
// Auth lib
//

import { AuthModule } from 'auth';

//
// Utils lib
//

// import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { UtilsModule, LoggerService, loggerProviders } from 'utils';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    AuthModule,
    CommonModule,
    OktaAuthModule,
    UtilsModule,

    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ LoginComponent ],
  providers: [
    // { provide: LoggerService, useClass: ConsoleLoggerService }
    loggerProviders
  ],
  exports: []
})
export class AuthOktaModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Auth Okta Module initialised');
  }

  static forRoot(config: AuthOktaConfig): ModuleWithProviders {

    return {
      ngModule: AuthOktaModule,
      providers: [
        { provide: AuthOktaConfigService, useValue: config },
        { provide: OKTA_CONFIG, useValue: config.oidc }
      ]
    };

  }

}

// https://github.com/okta/samples-js-angular/blob/master/okta-hosted-login/util/default-config.ts

/*

    // OktaAuthModule.initAuth(oidc),
    // { provide: OKTA_CONFIG, useValue: oidc }

*/
