# ADR-0001: Backend for Frontend as OAuth 2.0 confidential client

**Status:** Accepted

**Date:** 2026-09-11

**Context**

Serendipity's Angular PWA needs to call the Party Service API on behalf of authenticated users. The system uses Keycloak as the identity provider, issuing OpenID Connect access tokens via OAuth 2.0.

We considered three approaches:

1. **Frontend as public client** — the Angular application obtains tokens directly from Keycloak and sends them with each API request. This is simpler but exposes tokens to the browser, requires CORS configuration on every backend endpoint, and violates the guidance in the [OAuth 2.0 for Browser-Based Applications](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps) specification.

2. **Backend for Frontend as confidential client** — the BFF obtains and manages tokens in the context of a server-side session (cookie-based), keeping tokens out of the browser, and forwards authenticated requests to the resource server. This adds a small amount of infrastructure but aligns with security best practice for browser-based applications.

3. **Separate API gateway** — introduces an independent gateway component for authentication and routing. More components to operate, and at our current scale the BFF already serves the routing and serving role.

**Decision**

We will use the **Backend for Frontend as a confidential OAuth 2.0 client**.

The BFF:

- Authenticates users via Keycloak's OpenID Connect flow
- Manages OAuth 2.0 access and refresh tokens in the context of a cookie-based session
- Keeps tokens on the server — they are never exposed to the browser
- Forwards requests to the Party Service, augmenting them with the correct access token
- Exposes endpoints the PWA can call without the frontend ever obtaining or storing a token

The Angular PWA authenticates via the BFF and does not interact with Keycloak directly for token acquisition.

**Consequences**

*Positive*

- OAuth 2.0 tokens are not exposed to the browser
- CORS is configured only on the BFF, not on every backend service
- The PWA is simpler — it deals with a session cookie, not token lifecycle
- The approach follows the IETF guidance for browser-based applications

*Negative*

- The BFF is the single point of contact for all API traffic and must be scaled and monitored accordingly
- Session state lives on the server (cookie-based session, not stateless JWT in the browser)
- Adding a new backend service means configuring the BFF to forward to it

*Notes*

- The Party Service is designed as an OAuth 2.0 resource server and accepts tokens forwarded by the BFF
- If a new service is added, the BFF must be extended to forward to it — this is the expected integration path
- This decision depends on Keycloak being the identity provider; changing the IdP would require revisiting the BFF's OAuth 2.0 client configuration
