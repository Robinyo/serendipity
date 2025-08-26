<h1 align="center">Backend for Frontend</h1>

### Introduction

The Backend for Frontend (BFF) design pattern is an architectural approach that a browser-based application can use to 
handle all of its authentication and authorisation responsibilities and API interactions, for example:

- The BFF interacts with an OAuth 2.0 Authorization Server as a confidential OAuth 2.0 Client.
- The BFF manages OAuth 2.0 access and refresh tokens in the context of a cookie-based session, avoiding the direct exposure of any tokens to the browser-based application.
- The BFF forwards all requests to a OAuth 2.0 Resource Server, augmenting them with the correct access token before forwarding them to the resource server.

The [OAuth 2.0 for Browser-Based Applications](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) specification outlines the threats, attack consequences, security considerations and best practices that must be taken into account when developing browser-based applications. 
It also discusses how different architectural approaches can help address some of these challenges.

### Application Architecture

The Progressive Web App ([PWA](.././pwa/README.md)) is [loaded](.././static-content/README.md) and runs in the web browser.

The PWA checks with the BFF if there is an active session by calling a "check session" API endpoint.

When no active session is found, the PWA triggers a navigation to the BFF to initiate the Authorization Code flow with 
the PKCE extension, to which the BFF responds by redirecting the browser to the authorization endpoint. 

When the user is redirected back, the browser delivers the authorization code to the BFF, where the BFF can then 
exchange it for tokens at the token endpoint using its client credentials and PKCE code verifier.

The BFF associates the obtained tokens with the user's session and sets a cookie in the response to keep track of this 
session. At this point, the redirect-based Authorization Code flow has been completed, so the BFF can hand control back 
to the PWA.

When the PWA wants to make a request to the resource server, it sends a request to the corresponding endpoint on the BFF. 
This request includes a cookie, allowing the BFF to obtain the proper tokens for this user's session. The BFF removes 
the cookie from the request, attaches the user's access token to the request, and forwards it to the actual resource server. 

The Backend for Frontend then forwards the response back to the Progressive Web App.
