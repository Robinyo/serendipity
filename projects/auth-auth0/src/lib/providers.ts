import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard, AuthService } from 'auth';

import { Auth0AuthGuard } from './guards/auth/auth.guard';
import { Auth0AuthService } from './services/auth/auth.service';
import { AuthInterceptor } from './http-interceptors/auth-interceptor';

export const authProviders = [
  {
    provide: AuthGuard,
    useClass: Auth0AuthGuard
  },
  {
    provide: AuthService,
    useClass: Auth0AuthService
  }

  /*
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
  */

];

/*

import { Router } from '@angular/router';

import { authServiceFactory } from './auth-service.factory';
// import { Auth0Config } from './models/models';
import { Auth0ConfigService } from './services/config.service';

import { LoggerService } from 'utils';

export const authProviders = [
  {
    provide: AuthGuard,
    useClass: Auth0AuthGuard
  },
  // { provide: AuthService, useClass: Auth0AuthService },
  {
    provide: AuthService,
    useFactory: authServiceFactory,
    deps: [
      Auth0ConfigService,
      Router,
      LoggerService
    ]
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    deps: [
      Auth0AuthService
    ],
    multi: true
  }
];

*/
