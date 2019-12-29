# OpenID Connect (OIDC) Authentication (AuthN) library

## Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build auth-oidc
```

## Auth Providers

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

## Resources

### OIDC Libraries
* GitHub: [OpenID Connect (OIDC) and OAuth2 protocol support for browser-based JavaScript applications](https://github.com/IdentityModel/oidc-client-js)

### Auth Resources
* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Authorisation Servers
* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)
