import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { AuthConfig } from './models/models';
import { AuthConfigService } from './services/config.service';

// import { LoginComponent } from './components/login/login.component';

import { OktaLoginComponent } from './components/okta-login/okta-login.component';
// import { OktaSigninComponent } from './components/okta-signin/okta-signin.component';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    OktaAuthModule,
    FlexLayoutModule,
    UtilsModule,

    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ OktaLoginComponent ], // LoginComponent
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ OktaLoginComponent ]
})
export class AuthModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Flowable Module initialised');
  }

  static forRoot(config: AuthConfig): ModuleWithProviders {

    return {
      ngModule: AuthModule,
      providers: [
        { provide: AuthConfigService, useValue: config },
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
