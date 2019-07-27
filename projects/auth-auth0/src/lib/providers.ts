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
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
];
