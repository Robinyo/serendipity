# Serendipity — Architecture Decision Log

**Last updated:** 2026-09-16

This log records the architecture decisions that shape Serendipity, captured as
Architecture Decision Records (ADRs). The full ADR text for each entry lives in
`website/docs/architecture-guide/adr/`. This log is part of the `.knowledge/`
layer — it is the canonical, agent- and human-readable summary of *why* the
project is the way it is.

Dates are recorded at month precision (the ADRs were created in September 2026).
Consult the full ADR for detailed context.

---

## ADR-0001 — The BFF is an OAuth 2.0 confidential client

**Date:** 2026-09
**Status:** Accepted

The Angular PWA never sees raw OAuth 2.0 tokens. The Spring Boot Backend for
Frontend (BFF) authenticates users against Keycloak using OpenID Connect (OIDC),
maintains the session, and forwards the access token to backend services via the
Token Relay filter. The PWA talks only to the BFF over HTTPS, and the BFF issues
a session cookie to the PWA.

This is the foundation of the security model: token handling stays out of the
browser, authentication and session logic are centralized in the BFF, and backend
services can trust tokens forwarded by a known confidential client.

---

## ADR-0002 — Soft delete for Party entities

**Date:** 2026-09
**Status:** Accepted

Party entities use soft delete. The root `Party` entity carries a `toDate` field;
a `@SQLRestriction("to_date IS NULL or to_date > CURRENT_DATE")` filter excludes
soft-deleted parties from normal queries. Subtypes (`Organisation`, `Individual`)
do not repeat the soft-delete field — only `Party` (the root) has it.

Soft delete supports auditability and referential integrity: soft-deleted parties
remain in the database (for history, reporting, and foreign-key stability) while
being excluded from active-party queries by default.

---

## ADR-0003 — BFF CORS, CSRF, and session security

**Date:** 2026-09
**Status:** Accepted

The BFF enforces cross-origin request policy (CORS), protects against cross-site
request forgery (CSRF), and manages the session between the PWA and the backend.
These concerns live at the BFF, not in the PWA or in the backend services,
because the BFF is the trusted boundary between the browser and the services.

The browser is an untrusted environment for securing tokens and session state; the
BFF is where the session actually lives, so CORS/CSRF/session policy belongs there.

---

## ADR-0004 — Party Service trusts the BFF as its security boundary

**Date:** 2026-09
**Status:** Accepted

The Party Service does **not** configure itself as a standalone OAuth 2.0 resource
server. It trusts the BFF as its security boundary: the BFF is responsible for
authenticating the caller and forwarding a valid token, and the Party Service treats
the forwarded request as authenticated by virtue of that trust relationship. The
Party Service's `pom.xml` has no `spring-boot-starter-security` and no
`SecurityConfig`.

This resolves an inconsistency with ADR-0001, which states that the Party Service
"is designed as an OAuth 2.0 resource server and accepts tokens forwarded by the
BFF." ADR-0004 records the actual state clearly: the Party Service does not yet have
resource-server configuration, and mandating one would describe a design that did
not match the code. Implementing resource-server support is tracked as a roadmap
item (🔄).

---

## ADR-0005 — Party Service entity model is the source of truth

**Date:** 2026-09
**Status:** Proposed *(local-only; not yet pushed to `origin/main`)*

The Party Service entity model **as it exists in the codebase** is the source of
truth for the party domain. Any higher-level description (overview page,
cross-cutting documentation) must match the entities as shipped — not the other
way around. When the code and a doc disagree, the code wins and the doc is updated.

Key records:

- The Party Service entity model as shipped (`backend/modules/party-service/...
  /entity`) is the source of truth for the party domain.
- The Party Service overview page must match the entity model as shipped.
- Known gap: access-control-related fields (`ownedBy`, `assignedTo`,
  `assignedToTeam`, `ownedByManager`) are not yet present on the entities — the
  access-control design doc and the entity model doc both call this out.
- The manager hierarchy's `User.managedBy` field has no home because there is no
  Serendipity `User` entity — the decision is to enrich Keycloak's default user
  attributes instead (see `backend/security.md` and the User Provisioning doc).
- The Party Service `Role` entity is a domain tie-line
  (Customer/Prospect/Employee/Vendor); it is **not** the same as the
  access-control roles that live in Keycloak.
- Soft delete lives on `Party.toDate` (the root), not on the subtypes — this is a
  property of the entity model, not of a subtype.

---

## How to read this log

Each entry is a summary, not a substitute for the full ADR. When a decision
affects implementation, consult the full ADR in `website/docs/architecture-guide/
adr/` and the design documents it refines. When a decision is still Proposed,
treat it as a directional signal, not a binding commitment — the status field tells
you which is which.
