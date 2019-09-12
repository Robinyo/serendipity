# Local Authentication (AuthN) library

### Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build dynamic-forms
ng build auth-local
```


## Auth Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

//
// Auth libs
//

import { LocalAuthModule, authProviders } from 'auth-local';
// import { Auth0AuthModule, authProviders } from 'auth-auth0';
// import { OktaAuthModule, authProviders } from 'auth-okta';';

@NgModule({
  imports: [
    BrowserModule,
    LocalAuthModule,
    // Auth0AuthModule.forRoot(environment),
    // OktaAuthModule.forRoot(environment),
    CoreModule,
    AppRoutingModule  // https://angular.io/guide/router#routing-module-order
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

## Resources

### Auth Resources
* Firebase: [Sign in a user with an email address and password](https://firebase.google.com/docs/auth/web/password-auth)
* Firebase: [User Credential](https://firebase.google.com/docs/reference/js/firebase.auth.html#usercredential)

### Authorisation Servers
* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)
