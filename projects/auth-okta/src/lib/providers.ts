import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard, AuthService } from 'auth';

import { OktaAuthGuard } from './guards/auth/auth.guard';
import { OktaAuthService } from './services/auth/auth.service';
import { AuthInterceptor } from './http-interceptors/auth-interceptor';

export const authProviders = [
  {
    provide: AuthGuard,
    useClass: OktaAuthGuard
  },
  {
    provide: AuthService,
    useClass: OktaAuthService
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
];
