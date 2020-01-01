<h1 align="center">Authentication Library</h1>

## ❯ Development

To build the library:

```
ng build utils && \
ng build auth
```

This library provides an Authentication interface and includes a placeholder `AuthService` and `AuthGuard`.
The `AuthService` and `AuthGuard` implementation's should be replaced using Angular's DI system, for [example](https://github.com/Robinyo/serendipity/blob/master/projects/auth-oidc/src/lib/providers.ts):

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

## ❯ Auth Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

// import { LocalAuthModule, authProviders } from 'auth-local';
import { OidcAuthModule, authProviders } from 'auth-oidc';

@NgModule({
  imports: [
    BrowserModule,
    // LocalAuthModule,
    OidcAuthModule.forRoot(environment),
    CoreModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  providers: [
    loggerProviders,
    authProviders,
    angularMaterialProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

![divider](../../divider.png)

## ❯ Resources

### Auth Resources

* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

![divider](../../divider.png)
