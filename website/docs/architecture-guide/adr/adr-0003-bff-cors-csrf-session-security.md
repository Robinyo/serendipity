# ADR-0003: BFF CORS, CSRF, and session security model

**Status:** Accepted

**Date:** 2026-09-11

**Context**

The Backend for Frontend (BFF) sits between the Angular PWA and the backend services. It is the only component the browser communicates with directly, which means its security configuration — CORS, CSRF, session management, and authentication entry points — defines the security boundary of the entire application.

The BFF is configured as a Spring Security filter chain with the following concerns:

- **CORS** — the browser enforces same-origin policy. The BFF must explicitly allow the origins the Angular PWA runs on, the methods it can use, and the headers it can send.
- **CSRF** — cookie-based sessions are vulnerable to cross-site request forgery. The BFF must validate that state-changing requests originate from the same origin that received the session cookie.
- **Session management** — authentication is session-based (JSESSIONID cookie), not token-based in the browser. Session creation, validation, and destruction must be handled consistently.
- **Authentication entry points** — unauthenticated requests to API paths should receive a 401, not be redirected to a login page. The browser-based login flow is initiated explicitly, not via a redirect from an API call.

We considered several approaches within each concern:

1. **CORS — permissive vs restricted origins**
   - *Permissive* — allow any origin (`AllowedOrigins("***")` or a wildcard). Simplest to configure, but offers no protection against malicious sites triggering requests to the BFF.
   - *Restricted to specific origins* — only the production PWA domain and the local development origins are allowed. Requires updating the configuration when the origin changes (e.g. onboarding a new deployment environment), but provides meaningful boundary control.

2. **CSRF — stateless token vs synchronizer token vs disabled**
   - *Disabled* — simplest, but leaves cookie-based sessions vulnerable to CSRF. Acceptable only if no state-changing requests use cookies for authentication.
   - *Synchronizer token pattern* — Spring Security's default. A token is issued and must be present on state-changing requests. Works well with server-rendered HTML, but requires adaptation for single-page applications.
   - *Cookie-based double-submit* — the CSRF token is exposed as a cookie (via `CookieCsrfTokenRepository.withHttpOnlyFalse()`) and the client reads it and sends it back as a header (`X-XSRF-TOKEN`). This is the model Angular's `HttpClientXsrfModule` expects. The BFF reads the cookie, the Angular app reads the cookie and sends the value as a header. The BFF then validates the header against the token in the session.

3. **Session — stateful vs stateless**
   - *Stateless JWT in the browser* — the BFF issues a JWT and the browser stores it (e.g. in memory or local storage). Avoids server-side session state, but exposes the token to the browser and shifts token lifecycle concerns to the client.
   - *Cookie-based session (JSESSIONID)* — the session lives on the server, the browser holds only a session identifier cookie. The BFF is responsible for session creation, validation, and destruction. Aligns with the confidential client model in ADR-0001.

4. **Authentication entry points — redirect vs 401**
   - *Redirect to login* — unauthenticated requests are redirected to the OAuth2 login page. Suitable for browser navigation, but breaks API clients and creates confusing behavior if an API call triggers a redirect.
   - *401 for API paths, redirect for browser paths* — API paths (`/api/**`, `/v2/**`) receive a `401 Unauthorized` response, while browser-facing paths follow the normal OAuth2 login redirect. This requires distinguishing between the two in the exception handling configuration.

**Decision**

We will use the following security model for the BFF:

**CORS**

- Only the production PWA origin and the local development origin are allowed. The allowed origins are `https://serendipity.localhost` and `http://localhost:4200`.
- Allowed methods are `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS` (the last is required for CORS preflight).
- Allowed headers are `Authorization`, `Cache-Control`, `Content-Type`, and `X-XSRF-TOKEN`.
- Credentials (cookies) are allowed across origins (`allowCredentials = true`), which is required for the session cookie to be sent with cross-origin requests.

**CSRF**

- CSRF protection is enabled.
- The CSRF token is exposed as a cookie (`XSRF-TOKEN`) via `CookieCsrfTokenRepository.withHttpOnlyFalse()`, so the Angular application can read it.
- The Angular application sends the token value back as the `X-XSRF-TOKEN` header on state-changing requests.
- The BFF validates the header against the token stored in the session.
- Actuator endpoints are excluded from CSRF validation, as they are not state-changing from the application's perspective and may be accessed by monitoring tooling.
- A custom `CsrfTokenRequestHandler` is used to ensure the token is resolved and validated as a plain string, avoiding conflicts with Spring Security's default XOR-based token handling.

**Session management**

- Authentication is session-based. The session identifier is stored in a `JSESSIONID` cookie.
- The cookie is created with `withHttpOnlyFalse()` so the Angular application cannot read it directly (the CSRF token cookie is the one the application reads — not the session cookie).
- Session invalidation on logout deletes the `JSESSIONID` cookie and clears the authentication.

**Authentication entry points**

- Requests to `/api/**` and `/v2/**` that are unauthenticated receive a `401 Unauthorized` response (via `HttpStatusEntryPoint`).
- Browser-facing paths follow the normal OAuth2 login flow and redirect to Keycloak for authentication.

**Token relay**

- The BFF uses Spring Cloud Gateway's `TokenRelayFilterFunctions.tokenRelay()` as a global filter.
- This forwards the access token from the session to downstream services (e.g. the Party Service) on behalf of the authenticated user.
- The downstream services receive the token as if it came from the original client, without the browser ever seeing it.

**Static assets**

- Static assets (`/`, `/index.html`, `/*.js`, `/*.css`, `/*.ico`, `/assets/**`) and actuator endpoints are permitted without authentication.

**Logout**

- Logout is initiated via a `GET` to `/logout`.
- On logout: the HTTP session is invalidated, authentication is cleared, and the `JSESSIONID` cookie is deleted.
- The OIDC logout success handler then redirects to Keycloak to end the global SSO session, with a fallback redirect to the home page if the OIDC context is unavailable.

**Production configuration**

- The current CORS configuration is tuned for local development (`serendipity.localhost` and `localhost:4200`).
- Production origins must be configured separately, either via a profile-specific `CorsConfigurationSource` bean or via `application-{profile}.yml`.
- The local development configuration should not ship to production as-is.

**Consequences**

*Positive*

- The BFF presents a single, well-defined security boundary. CORS, CSRF, session management, and authentication are all configured in one place.
- CORS is restricted to known origins, reducing the attack surface compared to a permissive configuration.
- CSRF protection is in place for cookie-based sessions without requiring the browser to handle tokens directly.
- The cookie-based session model keeps tokens off the browser, consistent with ADR-0001.
- API paths return 401 for unauthenticated requests, which is the correct behavior for an API and avoids confusing redirects.
- The logout flow ends both the local BFF session and the global Keycloak SSO session.

*Negative*

- The CORS allowed origins are hard-coded for local development and must be externalized for production. If the production origin is not added before deployment, the PWA will be blocked by the browser.
- CSRF protection adds a header requirement to every state-changing request. The Angular application must be configured to read the `XSRF-TOKEN` cookie and send it as the `X-XSRF-TOKEN` header. If this configuration is missing or mismatched, state-changing requests will be rejected.
- Session-based authentication means session state lives on the server. In a scaled deployment, sessions must be shared across instances (e.g. via a shared session store) or sticky sessions must be used.
- The custom `CsrfTokenRequestHandler` adds complexity. It exists to resolve a specific interaction between Spring Security's default XOR-based token handling and the cookie-based double-submit pattern. If Spring Security's default behavior changes in a future version, this handler may need to be revisited.
- Logout via `GET` is convenient for the browser but is not strictly RESTful. It works for the current application but should not be relied upon for API clients.

*Notes*

- This ADR covers the CORS, CSRF, session, authentication entry point, and logout aspects of the BFF's security model. The OAuth 2.0 client model (confidential client, token relay, tokens off the browser) is covered by ADR-0001.
- The `CsrfCookieFilter` exists to force the lazy `CsrfToken` to resolve early so the `XSRF-TOKEN` cookie is written to the response on every request. Without it, the cookie may not be set on the first request, causing the Angular application to fail to send the CSRF header.
- The `CookieCsrfTokenRepository.withHttpOnlyFalse()` sets the CSRF token cookie as non-HttpOnly so the browser-side JavaScript can read it. This is intentional and required for the double-submit pattern. The session cookie (`JSESSIONID`) remains HttpOnly by default.
- If the Angular application ever switches to using a custom CSRF header name, the `allowedHeaders` list in the CORS configuration must be updated to include it.
- If a new backend service is added behind the BFF, the token relay filter already forwards the access token to it. No additional security configuration is required in the BFF for the new service, but the new service must be configured as an OAuth 2.0 resource server.
