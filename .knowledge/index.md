# Serendipity — Knowledge Index

**Last updated:** 2026-09-16

This is the canonical knowledge layer for the Serendipity project — a curated,
self-contained record of what the project is, how it is built, and the
architecture decisions that shape it. It is maintained in parallel with
`website/docs/` (the Docusaurus docs site source); the two layers are related
but distinct. This layer is intended to be agent- and human-readable as a
single source of truth for architectural and domain knowledge.

## What Serendipity is

Serendipity is an open-source **Customer Engagement Platform**, licensed under
**GNU AGPL v3.0**.

| Layer | Technology | Role |
|---|---|---|
| Frontend | Angular v22, Angular Material (M3) v20.2.1 | Browser-based SPA; the user-facing application |
| Backend for Frontend (BFF) | Spring Boot v4.0.1, Spring Cloud 2025.1.0, Java 25 | Confidential OAuth 2.0 client; authentication, session, token relay |
| Party Service | Spring Boot module (no SecurityConfig, no `spring-boot-starter-security` as shipped) | Customer-engagement domain — parties, names, addresses, roles |
| Identity Provider | Keycloak | OIDC/OAuth 2.0 — authentication, user accounts, groups, realm roles |
| Orchestration | Camunda 8.9 | BPMN/DMN workflow and task management |
| Database | PostgreSQL | Persistence for all services |
| Deployment | Docker Compose | Local and container-based development/runtime |

The full stack statement from the project README: *"Built using Angular v22,
Angular Material (M3) v20.2.1 and Spring Boot v4.0.1, Spring Cloud 25.0.1 and
Java 25."*

## Layered architecture

```
Angular PWA  ──►  BFF (confidential OAuth 2.0 client)  ──►  Backend services (Party Service, …)  ──►  PostgreSQL
                    │                                            ▲
                    │  session cookie (HttpOnly, Secure, SameSite) │
                    ▼                                            │
              Keycloak (IdP)  ◄─────────────────────────────────┘
              (OIDC / OAuth 2.0 — authentication, users, groups, realm roles)
```

- The **PWA never sees, stores, or handles raw access tokens or refresh tokens.**
  All token cryptography and session management lives in the BFF.
- The **BFF is the security boundary for identity** — it authenticates the user
  via the OAuth 2.0 Authorization Code Flow, holds the `client_secret`, and
  manages the session cookie.
- The **BFF forwards requests to backend services**, augmenting them with the
  correct access token. Backend services (e.g. the Party Service) validate the
  token and enforce per-entity authorization.
- **Keycloak** is the system of record for users, groups, and coarse roles. It
  is the trust boundary for identity.
- The **PWA is not a trust boundary** for either identity or authorization.

## The two tokens

| Token | Carries | Read by |
|---|---|---|
| **ID token** | `sub`, `username`, `email`, `firstName`, `lastName`, and enriched custom user attributes (e.g. `manager`, `jobTitle`) | The BFF (to serve the PWA's profile view), and optionally the PWA via a BFF user-info endpoint. The PWA does **not** have direct access to the token. |
| **Access token** | `sub` (identity for the Party Service), `realm_access.roles` (coarse role), `groups` (team membership, via a Group Membership mapper), and optionally user attributes (e.g. `manager`) via a User Attribute mapper | The backend services (Party Service, etc.) — for per-entity authorization |

The stable identifier for a user is **`sub`** — the Keycloak user UUID. It is
system-generated, never reused, and the value used for ownership/assignment
comparisons and for the `manager` attribute value. It is **not** a user profile
attribute; it is the system-generated subject claim, conceptually equivalent to
Entra ID's Object ID (`oid`).

## Identity model (no Serendipity User table)

Serendipity does **not** maintain a Serendipity-internal User table or entity.
The user is a **Keycloak user**. The access-control model's manager hierarchy
lives as a **Keycloak custom user attribute** (`manager`), whose value is the
manager's `sub`. See `backend/security.md` and `log.md` (ADR-0005) for detail.

## Where knowledge lives

| Layer | Path | Purpose |
|---|---|---|
| This index | `.knowledge/index.md` | Global monorepo map and entry point |
| Decision log | `.knowledge/log.md` | Changelog of architecture decisions (ADRs) |
| Frontend knowledge | `.knowledge/frontend/index.md` | Angular architecture overview |
| Backend knowledge | `.knowledge/backend/index.md` | Spring Boot backend architecture (modules, build, runtime topology, how the pieces fit) |
| Backend security | `.knowledge/backend/security.md` | Spring Security, Keycloak, JWT, BFF security model |
| Integration | `.knowledge/integration/api-contracts.md` | API contract layer (OpenAPI / RestClient; placeholder in v1) |
| Docusaurus source | `website/docs/` | The rendered docs site source (deployed at `https://robinyo.github.io/serendipity`) |

## Process

1. **Proposal (design doc).** Write a design doc first — model, assumptions,
   alternatives, open questions. It is a proposal, not a decision.
2. **Review and decision.** If accepted, write an ADR recording the decision.
3. **ADR.** Each significant decision gets an ADR — numbered, immutable once
   accepted. ADRs live in `website/docs/architecture-guide/adr/`.
4. **Roadmap.** The corresponding workitem goes into `website/docs/roadmap.md`
   as a `⏳` item, moving to `✅` when done. The roadmap item links to the ADR.
5. **Implementation.** Code, configuration, realm, and infrastructure changes
   realize the decision.

ADRs are the durable record. Design docs are the proposal and reasoning behind
them; they are not discarded when a decision is made.

## ADR index (see `log.md` for full entries)

- **ADR-0001** — Backend for Frontend as OAuth 2.0 confidential client (**Accepted**)
- **ADR-0002** — Soft delete for Party entities using `toDate` (**Accepted**)
- **ADR-0003** — BFF CORS, CSRF, and session security model (**Accepted**)
- **ADR-0005** — Party Service entity model is the source of truth (**Proposed** — local-only; not yet accepted; not yet on `origin/main`)

## Living areas (open)

- **Manager attribute value decision** — `manager` stores the manager's `sub`.
  The question of how that value is populated at scale (manual Admin Console
  entry of the `sub`; federation from MS Entra ID mapping the manager's Object
  ID to the manager's `sub`; or storing a human-readable identifier and resolving
  at enforcement time) is a workflow decision, not yet finalized.
- **API contract layer** — no OpenAPI spec on disk yet (roadmap item). The
  current service surface is described in `integration/api-contracts.md`.
- **Frontend state management** — deferred; to be written once the Angular
  state code is read and a meaningful story is confirmed.
