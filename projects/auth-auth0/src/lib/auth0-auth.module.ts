import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Auth0AuthGuard } from './guards/auth/auth.guard';
import { Auth0AuthService } from './services/auth/auth.service';
import { authServiceFactory } from './auth-service.factory';
import { Auth0Config } from './models/models';
import { Auth0ConfigService } from './services/config.service';

import { AuthorizationCodeCallbackComponent } from './components/authorization-code/authorization-code.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';
import { ImplicitCallbackComponent } from './components/implicit-callback/implicit-callback.component';

//
// Auth lib
//

import { AuthModule } from 'auth';

//
// Utils lib
//

import { UtilsModule, LoggerService, loggerProviders } from 'utils';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    AuthModule,
    CommonModule,
    UtilsModule,

    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [
    AuthorizationCodeCallbackComponent,
    LoginRedirectComponent,
    ImplicitCallbackComponent
  ],
  providers: [
    /*
    Auth0AuthGuard,
    {
      provide: Auth0AuthService,
      useFactory: authServiceFactory,
      deps: [
        Auth0ConfigService,
        Router,
        LoggerService
      ]
    },
    */
    loggerProviders
  ],
  exports: []
})
export class Auth0AuthModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Auth0 Auth Module initialised');
  }

  static forRoot(config: Auth0Config): ModuleWithProviders {

    return {
      ngModule: Auth0AuthModule,
      providers: [
        { provide: Auth0ConfigService, useValue: config }
      ]
    };

  }

}
