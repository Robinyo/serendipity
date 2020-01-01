<h1 align="center">Auth Authentication library</h1>

<p align="center">
  <b>The Auth library provides an Authentication interface and includes a placeholder `AuthService` and `AuthGuard`.</b></br>
  <b>The `AuthService` and `AuthGuard` implementation's should be replaced using Angular's DI system.</b></br>
</p>

## ❯ Development

To build the library:

```
ng build utils && \
ng build auth
```

![divider](../../divider.png)

## ❯ Auth Providers

The Auth library provides an Authentication interface and includes a placeholder `AuthService` and `AuthGuard`.
The `AuthService` and `AuthGuard` implementation's should be replaced using Angular's DI system, for [example])https://github.com/Robinyo/serendipity/blob/master/projects/auth-oidc/src/lib/providers.ts):

```
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
```

![divider](../../divider.png)

## ❯ Resources

### Auth Resources

* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

![divider](../../divider.png)
