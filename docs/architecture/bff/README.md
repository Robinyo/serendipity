<h1 align="center">Backend for Frontend</h1>

### Introduction

The Backend for Frontend (BFF) design pattern is an architectural approach that a browser-based application can utilise 
to handle all of its authentication and authorisation responsibilities and API interactions, for example:

- The BFF interacts with an OAuth 2.0 Authorization Server as a confidential OAuth 2.0 Client.
- The BFF manages OAuth 2.0 access and refresh tokens in the context of a cookie-based session, avoiding the direct exposure of any tokens to the browser-based application.
- The BFF forwards all requests to a OAuth 2.0 Resource Server, augmenting them with the correct access token before forwarding them to the resource server.

The [OAuth 2.0 for Browser-Based Applications](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) specification outlines the threats, attack consequences, security considerations and best practices that must be taken into account when developing browser-based applications. 
It also discusses how different architectural approaches can help address some of these challenges.

### Application Architecture

