import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard, AuthService } from 'auth';

import { OidcAuthGuard } from './guards/auth/auth.guard';
import { OidcAuthService } from './services/auth/auth.service';
import { AuthInterceptor } from './http-interceptors/auth-interceptor';

export const authProviders = [
  {
    provide: AuthGuard,
    useClass: OidcAuthGuard
  },
  {
    provide: AuthService,
    useClass: OidcAuthService
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
];
