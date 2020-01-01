<h1 align="center">Local Authentication Library</h1>

<p align="center">
  <b>The Local Authentication library supports email/password registration and login.</b></br>
</p>

## ❯ Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build dynamic-forms
ng build auth-local
```

![divider](../../divider.png)

## ❯ Auth Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

import { LocalAuthModule, authProviders } from 'auth-local';
// import { OidcAuthModule, authProviders } from 'auth-oidc';

@NgModule({
  imports: [
    BrowserModule,
    LocalAuthModule,
    // OidcAuthModule.forRoot(environment),
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

* Firebase: [Sign in a user with an email address and password](https://firebase.google.com/docs/auth/web/password-auth)
* Firebase: [User Credential](https://firebase.google.com/docs/reference/js/firebase.auth.html#usercredential)

![divider](../../divider.png)
