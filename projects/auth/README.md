# Auth Authentication (AuthN) library

The Auth library provides an Authentication interface and includes a placeholder `AuthService` and `AuthGuard`.

The `AuthService` and `AuthGuard` implementation's should be replaced using Angular's DI system, for example:

```
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
```

### Development

To build the library:

```
ng build utils && \
ng build auth
```

