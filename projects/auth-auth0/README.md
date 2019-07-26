# Auth0 Authentication (AuthN) library

### Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build auth-auth0
```

### Auth Providers

The Auth providers are configured in the project's App module:

app.module.ts:

```
//
// Auth libs
//

// import { AuthModule } from 'auth';
// import { AuthOktaModule, authProviders } from 'auth-okta';
import { Auth0AuthModule, authProviders } from 'auth-auth0';

...

@NgModule({
  imports: [
    BrowserModule,
    Auth0AuthModule.forRoot(environment),
    CoreModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  providers: [
    loggerProviders,
    authProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

## Resources

### Auth0 Auth Libraries
* GitHub: [Auth0 Authentication for Single Page Applications with PKCE](https://github.com/auth0/auth0-spa-js)

### Auth Resources
* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Additional Auth Resources
* Auth0's blog: [The Auth0 SPA JS SDK](https://auth0.com/blog/introducing-auth0-single-page-apps-spa-js-sdk/)

### Authorisation Servers
* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)
