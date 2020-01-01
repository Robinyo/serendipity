<h1 align="center">Auth0 Authentication Library</h1>

<p align="center">
  <b>The Auth0 Authentication library supports email/password registration and login.</b></br>
</p>

## ❯ Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build auth-auth0
```

![divider](../../divider.png)

## ❯ Auth Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

// import { LocalAuthModule, authProviders } from 'auth-local';
import { Auth0AuthModule, authProviders } from 'auth-auth0';

@NgModule({
  imports: [
    BrowserModule,
    // LocalAuthModule,
    Auth0AuthModule.forRoot(environment),
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

## ❯ Auth0 Tenants

For all new Auth0 tenants **seamless SSO is enabled and cannot be disabled**. 
When signing in (for example, via the Authorization Code Flow with PKCE) you will receive a 404 from the following endpoint:

```
GET https://<DOMAIN>/user/ssodata
```

You will receive this error when signing into Auth0 (although this error is unrelated to the [standards-based](https://www.ietf.org/) 
activity you are trying to perform).

![divider](../../divider.png)

## ❯ Screen Shots

Login page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/auth0-login.png">
</p>

![divider](../../divider.png)

## ❯ Resources

### Auth0 Auth Libraries

* GitHub: [Auth0 Authentication for Single Page Applications with PKCE](https://github.com/auth0/auth0-spa-js)

### Auth Resources

* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Additional Auth Resources

* Auth0's blog: [The Auth0 SPA JS SDK](https://auth0.com/blog/introducing-auth0-single-page-apps-spa-js-sdk/)

![divider](../../divider.png)
