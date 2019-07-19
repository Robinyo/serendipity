# Auth - Authentication (AuthN) library

The Auth library provides an Authentication interface and includes a placeholder `AuthService` and `AuthGuard`.

The `AuthService` and `AuthGuard` implementation's should be replaced using Angular's DI system, for example:

```
import { AuthService, AuthGuard } from 'auth';

import { AuthOktaService } from './services/auth/auth-okta.service';
import { AuthOktaGuard } from './guards/auth/auth-okta.guard';

export const authProviders = [
  { provide: AuthService, useClass: AuthOktaService },
  { provide: AuthGuard, useClass: AuthOktaGuard }
];
```

### Development

To build the library:

```
ng build utils && \
ng build auth
```

