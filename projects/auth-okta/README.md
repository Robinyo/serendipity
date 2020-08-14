<h1 align="center">Okta Authentication Library</h1>

<p align="center">
  <b>The Auth0 Authentication library supports email/password registration and login.</b></br>
</p>

## ❯ Development

To build the library:

```
# npm install -P @okta/okta-auth-js
ng build utils && \
ng build auth && \
ng build auth-okta
```

![divider](../../divider.png)

## ❯ Auth Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

// import { LocalAuthModule, authProviders } from 'auth-local';
import { OktaAuthModule, authProviders } from 'auth-okta';';

@NgModule({
  imports: [
    BrowserModule,
    // LocalAuthModule,
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

![divider](../../divider.png)

## ❯ Screen Shots

Login page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/okta-login.png">
</p>

![divider](../../divider.png)

## ❯ Resources

### Okta Auth Libraries

* GitHub: [Okta Auth JavaScript SDK](https://github.com/okta/okta-auth-js)

### Auth Resources

* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Additional Auth Resources

* Okta's blog: [Is the OAuth 2.0 Implicit Flow Dead?](https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-dead)

![divider](../../divider.png)
