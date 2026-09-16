# Serendipity — Frontend Architecture

**Last updated:** 2026-09-16

This document describes the Serendipity frontend architecture: the Angular SPA,
how it authenticates and talks to the backend, and the relationship between the PWA
and the BFF. It is part of the `.knowledge/` layer and is the canonical frontend
reference — the Docusaurus docs at `website/docs/` refine it with component-level
detail.

## Stack

- **Frameworks:** Angular v22, Angular Material (M3) v20.2.1.
- **Type:** Browser-based single-page application (SPA), delivered as a
  Progressive Web App (PWA).
- **Role:** The user-facing application. Presents dashboards, party records, and
  operational workflows.

The frontend is a PWA — designed to work as a standalone web application with
offline-capable characteristics and a service worker, rather than as a
server-rendered page.

## Authentication — the BFF is the boundary

The frontend **never sees raw OAuth 2.0 tokens**. Authentication is handled by the
**Backend for Frontend (BFF)** — a Spring Boot application that acts as an OAuth
2.0 confidential client.

The flow:

1. The PWA redirects the user to Keycloak for authentication (OIDC).
2. Keycloak authenticates the user and redirects back to the BFF with an
   authorization code.
3. The BFF exchanges the authorization code for tokens (ID token, access token)
   using its client credentials (client ID + secret).
4. The BFF maintains the session and issues a **session cookie** to the PWA.
5. The PWA talks only to the BFF over HTTPS. Every request carries the session
   cookie. The BFF, on behalf of the authenticated user, forwards the access token
   to backend services when it calls them.

The PWA's only credential is the session cookie. The access token and ID token live
server-side, in the BFF's session. This is the **confidential client pattern**
— recorded in [ADR-0001](./log.md#adr-0001).

## The `/api/me` profile endpoint

Because the PWA cannot read the tokens directly, it gets the user's identity
profile from the BFF via a backend endpoint — conventionally `/api/me`. The BFF
reads the ID token (or the session it already built from the ID token) and returns a
`UserProfile` object to the PWA.

The `UserProfile` the PWA sees includes:

- `authenticated` — whether the user is authenticated
- `username` — the user's Keycloak `username` (the primary login name, not
  `preferred_username`)
- `name`, `email`, `firstName`, `lastName` — identity attributes from the ID token
- `id` — the user's Keycloak `sub` (stable UUID)
- `jobTitle`, `department`, `companyName`, `employeeId`, `employeeType`,
  `employeeHireDate` — enrichment attributes from Keycloak's custom user attributes
- `roles?: string[]` — the user's realm roles, supplied by the BFF from the access
  token's `realm_access.roles`

Two things to be precise about here:

- `username` is Keycloak's default managed attribute (`username`), not the OIDC
  `preferred_username` claim. The PWA's profile uses `username`.
- `roles?: string[]` is **not a Keycloak attribute** and is **not redundant** with
  realm roles. It is the PWA's view, supplied by the BFF, of the roles that are
  already in the access token's `realm_access.roles`. The BFF translates them into
  an array for the frontend's convenience. The PWA cannot see the token directly —
  only the session cookie — so this translation is how the frontend learns its roles.

## Token relay to backend services

When the BFF calls a backend service (for example, the Party Service) on behalf of
the authenticated user, it forwards the **access token** — the same access token
Keycloak issued to the BFF. This is the **Token Relay** pattern: the BFF acts as a
token-forwarding proxy, so the backend service sees a request carrying a valid
access token that identifies the user.

This is what lets backend services do authorization — they can extract the caller's
`sub` and roles from the forwarded access token. The BFF is responsible for
authenticating the user and obtaining the token; the backend service is responsible
for enforcing access control on the requests it receives.

**Current state and open item:** The Party Service currently trusts the BFF as its
security boundary and does not configure itself as an OAuth 2.0 resource server
(ADR-0004). Implementing resource-server support on the Party Service (so it
validates the forwarded access token itself) is a 🔄 roadmap item. The intent —
that backend services receive and can act on the forwarded access token — is clear;
the full resource-server implementation is the open work.

## Two-token model — frontend's view

From the frontend's perspective, the distinction is simple:

- The **ID token** is what built the user's profile (served by the BFF via `/api/me`).
  The PWA's `UserProfile` is the ID token's identity attributes, reformatted for the
  frontend.
- The **access token** is what the BFF forwards to backend services. The PWA does not
  see it directly. It exists so backend services can authorize requests.

The PWA does not need to know which token is which. It knows: authenticate via the
BFF, get a session cookie, call the BFF, and the BFF handles the rest. The token
model is a backend concern that the PWA benefits from without managing.

## Dev auth toggle and mock principal

The BFF supports a **dev auth toggle** — a property that, when enabled, substitutes a
mock/developer principal for real Keycloak authentication. This lets developers run
the application locally without a running Keycloak instance, using a known test user
identity. The disabled-auth / dev-auth configuration lives in the BFF's Spring
Security configuration (a `DisabledAuthSecurityConfig` bean, conditional on the
property).

This is a development convenience, not a production behavior. In production, the BFF
authenticates against the real Keycloak instance.

## What the frontend does not do

For clarity, the frontend does **not**:

- Store access tokens or refresh tokens in the browser (session cookie only).
- Authenticate directly against Keycloak (the BFF handles the OIDC flow).
- Make cross-origin requests to backend services directly (it talks to the BFF).
- Manage token refresh, rotation, or revocation (the BFF does).

These are all deliberately pushed to the BFF, because the browser is an untrusted
environment for token handling and the BFF is the trusted boundary.

## State management (NgRx / Signals)

**Deferred — not yet written.** When written, this document will describe the
Angular state-management conventions in use: whether the frontend uses NgRx, Signals,
a hybrid, or service-level state, and the conventions around effects, selectors,
signal-based state, and how the PWA reflects authorization data (roles, user
profile) in its local state. Not yet written because the Angular codebase's
state-management story has not been surveyed in this layer — the source of truth
would be the Angular modules, stores, and services under `frontend/`.

## Related documents

- [ADR-0001](./log.md#adr-0001) — BFF as OAuth 2.0 confidential client
- [ADR-0003](./log.md#adr-0003) — BFF CORS, CSRF, session security
- [Backend — Security](./backend/security.md) — full backend security model
  (two-token model, roles, groups, `manager` attribute, enforcement)
- [BFF overview and configuration](https://robinyo.github.io/serendipity/docs/
  components/bff/overview/) — BFF component documentation (Docusaurus)
- [PWA overview and configuration](https://robinyo.github.io/serendipity/docs/
  components/pwa/overview/) — PWA component documentation (Docusaurus)
- [Identity overview](./index.md) — high-level identity model
- [Authentication concept](https://robinyo.github.io/serendipity/docs/concepts/
  authentication/) — authentication concept documentation (Docusaurus)
