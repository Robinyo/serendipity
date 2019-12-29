# Okta Authentication library

## Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build auth-okta
```

## Auth Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

//
// Auth libs
//

// import { LocalAuthModule, authProviders } from 'auth-local';
// import { Auth0AuthModule, authProviders } from 'auth-auth0';
import { OktaAuthModule, authProviders } from 'auth-okta';';

@NgModule({
  imports: [
    BrowserModule,
    // LocalAuthModule,
    // Auth0AuthModule.forRoot(environment),
    OktaAuthModule.forRoot(environment),
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

### Okta Auth Libraries
* GitHub: [Okta Auth JavaScript SDK](https://github.com/okta/okta-auth-js)

### Auth Resources
* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Additional Auth Resources
* Okta's blog: [Is the OAuth 2.0 Implicit Flow Dead?](https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-dead)

### Authorisation Servers
* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)
