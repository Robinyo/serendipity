// import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard, AuthService } from 'auth';

import { LocalAuthGuard } from './guards/auth/auth.guard';
import { LocalAuthService } from './services/auth/auth.service';


export const authProviders = [
  {
    provide: AuthGuard,
    useClass: LocalAuthGuard
  },
  {
    provide: AuthService,
    useClass: LocalAuthService
  }

];

/*

import { AuthInterceptor } from './http-interceptors/auth-interceptor';

  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }

*/
