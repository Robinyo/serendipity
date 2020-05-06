<h1 align="center">OpenID Connect Authentication Library</h1>

<p align="center">
  <b>The OpenID Connect Authentication library supports email/password registration and login (using Implicit Flow or Authorization Code Flow with PKCE).</b></br>
</p>

## ❯ Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build auth-oidc
```

![divider](../../divider.png)

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

## ❯ Screen Shots

Keycloak Register page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-register.png">
</p>

Keycloak Login page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-login.png">
</p>

![divider](../../divider.png)

## ❯ Resources

### OpenID Connect and OAuth 2.0 Libraries

* GitHub: [OpenID Connect (OIDC) and OAuth2 protocol support for browser-based JavaScript applications](https://github.com/IdentityModel/oidc-client-js)

### Auth Resources

* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Authorisation Servers

* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)
* GitHub: [A curated list of resources for learning about Keycloak](https://github.com/thomasdarimont/awesome-keycloak)

### Blog Posts

* Rob Ferguson's blog: [Getting started with Keycloak](https://robferguson.org/blog/2019/12/24/getting-started-with-keycloak/)
* Rob Ferguson's blog: [Angular, OpenID Connect and Keycloak](https://robferguson.org/blog/2019/12/29/angular-openid-connect-keycloak/)
* Rob Ferguson's blog: [Angular, OAuth 2.0 and Keycloak](https://robferguson.org/blog/2019/12/31/angular-oauth2-keycloak/)
* Rob Ferguson's blog: [Keycloak, Flowable and OpenLDAP](https://robferguson.org/blog/2020/01/03/keycloak-flowable-and-openldap/)
* Rob Ferguson's blog: [Flowable OAuth2 Resource Server](https://robferguson.org/blog/2020/02/05/flowable-oauth2-resource-server/)
* Rob Ferguson's blog: [Keycloak Themes - Part 1](https://robferguson.org/blog/2020/04/12/keycloak-themes-part-1/)
* Rob Ferguson's blog: [Keycloak Themes - Part 2](https://robferguson.org/blog/2020/04/17/keycloak-themes-part-2/)

![divider](../../divider.png)
