# Auth Okta - Okta Authentication (AuthN) library

### Development

To build the library:

```
ng build utils && \
ng build auth && \
ng build auth-okta
```

## Resources 

### Auth Resources
* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)
* Brock Allen's blog: [The State of the Implicit Flow in OAuth2](https://brockallen.com/2019/01/03/the-state-of-the-implicit-flow-in-oauth2/)
* Auth0 blog: [OAuth2 Implicit Grant and SPA](https://auth0.com/blog/oauth2-implicit-grant-and-spa/)
* Scott Brady's blog: [SPA Authentication using OpenID Connect, Angular CLI and oidc-client](https://www.scottbrady91.com/Angular/SPA-Authentiction-using-OpenID-Connect-Angular-CLI-and-oidc-client)
* Scott Brady's blog: [Silent Refresh - Refreshing Access Tokens when using the Implicit Flow](https://www.scottbrady91.com/OpenID-Connect/Silent-Refresh-Refreshing-Access-Tokens-when-using-the-Implicit-Flow)
* Scott Brady's blog: [Migrating oidc-client-js to use the OpenID Connect Authorization Code Flow and PKCE](https://www.scottbrady91.com/Angular/Migrating-oidc-client-js-to-use-the-OpenID-Connect-Authorization-Code-Flow-and-PKCE)

### Angular Auth Libraries
* GitHub: [Angular OAuth 2.0 OICD](https://github.com/manfredsteyer/angular-oauth2-oidc)
* GitHub: [Okta Angular SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-angular)

**Note:** Both libraries (above) currently only support the 'OAuth 2.0 Implicit Flow'.

* GitHub: [OpenID Connect Code Flow with PKCE, Implicit Flow](https://github.com/damienbod/angular-auth-oidc-client)

### Other Auth Libraries
* GitHub: [oidc-client-js](https://github.com/IdentityModel/oidc-client-js)

**Note:** This library (above) currently supports the 'OAuth 2.0 Authorization Code Flow with PKCE'.

### Authorisation Servers
* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)
