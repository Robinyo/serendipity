# Serendipity — Backend Security

**Last updated:** 2026-09-16

This document describes how Serendipity handles security on the backend:
authentication (Keycloak / OIDC), the two-token model, how authorization data
gets into tokens, the role and group model, the `manager` attribute and manager
hierarchy, and the enforcement approach. It is part of the `.knowledge/` layer
and is the canonical backend-security reference — the Docusaurus docs at
`website/docs/` refine it with full design documents.

## Stack

- **Identity provider:** Keycloak, speaking OpenID Connect (OIDC) for
  authentication and OAuth 2.0 for authorization.
- **Backend for Frontend (BFF):** Spring Boot v4.0.1, Spring Cloud 2025.1.0,
  Java 25. Authenticates users against Keycloak, maintains the session, and
  forwards the access token to backend services via the Token Relay filter.
- **Backend services (example):** Party Service. Currently trusts the BFF as
  its security boundary (ADR-0004) — no `spring-boot-starter-security`, no
  `SecurityConfig` on the Party Service yet.

The core properties:

1. **No tokens in the browser.** The Angular PWA holds only a session cookie
   issued by the BFF. The access token and ID token live server-side, in the
   BFF's session.
2. **Confidential client pattern.** The BFF is an OAuth 2.0 confidential client
   — it authenticates to Keycloak with its own credentials (client ID + secret)
   and handles the token exchange.
3. **Token relay.** When the BFF calls a backend service, it forwards the
   access token on the caller's behalf, so the service knows who is asking.
4. **TLS in transit, AES at rest.** Network traffic encrypted in transit;
   secrets at rest encrypted with AES.

See ADR-0001 (BFF as confidential client), ADR-0003 (BFF CORS/CSRF/session),
and ADR-0004 (Party Service trusts BFF) in `log.md`.

## Identity is carried by the ID token

The user's identity in Serendipity is carried by the **ID token** Keycloak
issues (and, if needed, the `userinfo` endpoint). The ID token carries the
user's identity *attributes* — the display/profile information that the BFF uses
to build the user's view for the PWA.

Key identity attributes (delivered in the ID token or via `userinfo`):

| Attribute | Source | Notes |
|---|---|---|
| `sub` | Keycloak system-generated UUID | Stable, immutable identity reference within Keycloak. **Not** a user-profile attribute — it is the OIDC subject claim. Conceptual equivalent of Entra ID's Object ID. |
| `username` | Keycloak default managed attribute | One of Keycloak's four default managed attributes (`username`, `email`, `firstName`, `lastName`). The primary login name. **Not** `preferred_username`. |
| `email` | Keycloak default managed attribute | Preferred email address. |
| `firstName` | Keycloak default managed attribute | Given name. |
| `lastName` | Keycloak default managed attribute | Surname. |
| `manager` | Keycloak custom attribute (defined in realm user profile schema) | Stores the **manager's `sub`** — the stable UUID of the user's manager. Used by the manager-hierarchy enforcement path. |
| `jobTitle`, `department`, `companyName`, `employeeId`, `employeeType`, `employeeHireDate` | Keycloak custom attributes (optional) | Enrichment attributes beyond the four defaults. |

### Two-token model — be precise

- **ID token** — carries the user's identity attributes: `sub`, `username`,
  `email`, `firstName`, `lastName`, `manager`, and any other custom attributes
  mapped in. The BFF uses this to build the user's profile for the PWA (served
  from the BFF's `/api/me` endpoint). The PWA's `UserProfile` is built from the
  ID token (via the BFF), not from the access token.
- **Access token** — carries `sub` plus the authorization claims the backend
  needs: `sub`, `realm_access.roles`, `groups` (if configured), and — critically
  for the manager-hierarchy check — the `manager` attribute **if a User
  Attribute mapper emits it into the access token**. The BFF forwards the access
  token to backend services. The backend (once it becomes an OAuth 2.0 resource
  server) reads this token for authorization.

The access token does **not** carry the full identity attribute set by default —
it carries `sub` and whatever authorization claims are configured to be included
(realm roles, groups, optionally `manager` via a mapper). Identity attributes for
display come from the ID token.

### The `sub` — what it is and what it is not

The `sub` is the OIDC subject claim — Keycloak's internally-generated, stable,
never-reused UUID for a user. It is:

- **System-generated**, not configurable. Keycloak assigns it when the user is
  created; you do not set it.
- **Stable and never-reused** — the immutable identity reference within Keycloak.
- **Not a user-profile attribute.** It is not part of Keycloak's User Profile
  schema (the schema that defines configurable/managed attributes like
  `username`, `email`, `firstName`, `lastName`, with policies for
  required/read-only/regex validation). The `sub` is outside that schema because
  it is the system-assigned stable identifier, not a user-managed attribute.

In concept, the Keycloak `sub` is equivalent to **Entra ID's Object ID** — both
are system-generated, stable, never-reused UUIDs that serve as the primary
immutable identity reference within their respective directory. They are distinct
from the human-usable login name (Keycloak `username` / Entra ID UPN).

**Nuance when federating Entra ID as IdP through Keycloak:** If you broker
Entra ID authentication through Keycloak (OIDC/SAML federation), Entra ID's stable
Object ID arrives in the `oid` claim, not in `sub`. Entra ID's own `sub` claim is
per-client and opaque. In a pure Keycloak setup (no upstream IdP), Keycloak's
`sub` is the stable UUID and that is what you store in `manager`,
`ownedBy`, `assignedTo`, and enforcement comparisons.

## No Serendipity `User` table

Serendipity does **not** have a `User` table. Users are Keycloak users. The
project enriches Keycloak's default user attributes (via the realm's User Profile
schema) with the attributes Serendipity needs — most importantly `manager`, which
stores the manager's `sub`.

This means:

- There is no Serendipity-internal user record to maintain. User identity, login,
  credentials, and the enriched attributes all live in Keycloak.
- The manager hierarchy does **not** read from a Serendipity `User.managedBy`
  field. It reads the owning user's `manager` attribute — from the access token
  (if a User Attribute mapper emits it) or from Keycloak at enforcement time.
- The `ownedByManager` convenience field on the Party entity is a **snapshot
  mirror** of the owning user's `manager` attribute, captured at entity creation
  or last-owned time. It exists because the owning user's `manager` attribute can
  change independently, and the enforcement layer sometimes needs a fast path that
  does not require a Keycloak round-trip. It is a convenience, not the source of
  truth.

See the User Provisioning document for the full attribute schema and how `manager`
is set today (manual, via the Admin Console's Attributes tab) and how it would be
populated in an enterprise deployment (federation to MS Entra ID).

## Roles

Serendipity's authorization model uses four roles. The role names below are the
**Keycloak role names** (lower-case, hyphenated — the Keycloak convention).
Spring Security authority names are distinct: `hasRole()` prepends `ROLE_`
automatically, so the corresponding authorities are
`ROLE_SYSTEM_ADMINISTRATOR`, `ROLE_SALES_MANAGER`, `ROLE_SALESPERSON`, and
`ROLE_BASIC_USER`.

| Keycloak role name | Spring Security authority | Scope and intent |
|---|---|---|
| `system-administrator` | `ROLE_SYSTEM_ADMINISTRATOR` | Full, unrestricted access across the system. Non-editable — the role exists as a boundary, not a day-to-day working role. |
| `sales-manager` | `ROLE_SALES_MANAGER` | Sales Manager. Operates at Business Unit scope (or Parent-Child depth). Can manage team members' records. |
| `salesperson` | `ROLE_SALESPERSON` | Salesperson. Basic role, operating at User/Business Unit scope. |
| `basic-user` | `ROLE_BASIC_USER` | Basic User. System-level role — view system dashboards and manage personal preferences. No records-domain access (Accounts, Contacts, etc.). |

- **Realm roles, not client roles.** The roles above are realm roles. Realm roles
  are included in the token by default (no mapper needed) — they appear in the
  `realm_access.roles` claim of the access token. Client roles would require a
  mapper and are not used here, because these are system-wide roles.
- **`roles?: string[]` on the PWA's `UserProfile` is not a Keycloak attribute.** It
  is the PWA's view, supplied by the BFF from the token's `realm_access.roles`.
  The PWA cannot read the token directly — it only has the session cookie — so the
  BFF translates the token's roles into the `UserProfile.roles` array for the
  frontend's convenience. This is not redundant with realm roles; it is the same
  information reformatted for the frontend.

## Groups and team membership

Serendipity uses **Keycloak groups** for team membership. Groups are included in
the access token via a **Group Membership mapper** — configured to emit the group
path so the backend can tell which groups (teams) the caller belongs to.

**Why groups, not an internal team table:** team membership is a Keycloak concern,
consistent with the "no User table" decision. Users are Keycloak users; their team
membership is expressed as group membership in Keycloak. The backend reads group
membership from the token to enforce team-based access.

**Mapper configuration note (to verify in the realm):** the Group Membership mapper
should be configured with full path **off** (emit just the group name, not the full
hierarchical path) unless the enforcement model needs hierarchy. This is a realm
configuration detail that should be verified against the actual realm — the design
doc asserts the intent; the realm is the source of truth for what is actually emitted.

## The `manager` attribute and manager hierarchy

The `manager` attribute is a **custom Keycloak user attribute** whose value is the
**manager's `sub`** (the stable UUID of the user's manager). It is defined in the
realm's User Profile schema as a managed attribute (optional), and optionally
validated with a UUID-format regex if the stored value is a `sub`.

**How the manager hierarchy works in enforcement:**

When **enabled**, the manager hierarchy grants a Sales Manager access to their
direct reports' records **regardless of role depth**. That is: a Sales Manager can
read/edit records owned by users who report to them (whose `manager` attribute
equals the Sales Manager's `sub`), even if those records would not otherwise be in
the Sales Manager's role scope.

The enforcement sketch (in the Access Control design document) has the manager
hierarchy as its own **first-class check** — a separate `if` block, distinct from
the owning-user-team check. The check reads the owning user's `manager` attribute
and compares it against the current user's `sub`.

**Where the `manager` value comes from at enforcement time:**

1. **From the access token** — if a Keycloak **User Attribute mapper** is
   configured to emit the `manager` attribute into the access token, the
   enforcement layer reads it from the token directly (alongside `sub`,
   `realm_access.roles`, and `groups`).
2. **From Keycloak at enforcement time** — if no mapper emits `manager` into the
   access token, the enforcement layer resolves the owning user's `manager`
   attribute by calling Keycloak (admin API or a cached mapping). This is the
   fallback path.

The design doc's current stance is **`sub`-as-value**: the `manager` attribute
stores the manager's `sub`, and enforcement compares `currentSub` against the
owning user's `manager` attribute value directly. The cost of this stance is that
entering a manager's `sub` manually (copying a UUID from one user's Details tab to
another's Attributes tab) is not admin-friendly — workable for a small team,
repetitive for a large one.

**The value-mapping tradeoff (open, not yet decided):** If you prefer a
human-readable value (e.g. the manager's `username` or email) instead of a `sub`,
the enforcement layer needs to resolve that value to a `sub` first — the same
shape as the `ownedByTeam` lookup option. This is an open decision; the doc
currently assumes `sub`-as-value.

**Enterprise deployment — federation to MS Entra ID:** In a typical enterprise
deployment, Serendipity federates to MS Entra ID (via Keycloak User Federation or
IDP brokering). Federation changes *where the `manager` value comes from* and *how
it is mapped*, not what the value means. Entra ID's user object carries a `manager`
attribute (the manager's Entra ID Object ID, or their DN, depending on access
method), so a Keycloak attribute also named `manager` maps cleanly at federation
time — self-documenting and low cognitive load. But Entra ID's `manager` carries
the manager's Entra ID Object ID, **not** the manager's Keycloak `sub`, so the
federation mapper must still produce a `sub`-valued `manager` (option A: map
upstream Entra ID `manager` → manager's Keycloak `sub`, possibly using a
`directoryObjectId` custom attribute on each Keycloak user to look up the manager's
`sub` at import time), or store the upstream Object ID and resolve to `sub` at
enforcement time (option B: same tradeoff as `ownedByTeam`, now from a real
upstream source).

## Enforcement approach

Enforcement uses Spring Security 6.x's **AuthorizationManager SPI** — the idiomatic
approach for Spring Boot 4.x, aligning with Spring Security's current direction.
(That choice — AuthorizationManager over a named ACL helper + `@PreAuthorize` — is
recorded in the Access Control design document and refined there.)

The enforcement layer extracts `sub` from the validated JWT (the access token,
validated by Spring Security's OAuth 2.0 resource server support). The `sub` is in
both the ID token and the access token, so extracting it from the validated JWT is
correct regardless of which token is being validated.

See the Access Control design document for the full authorization model, operation
matrices, the enforcement sketch, and the open questions.

## What is still open

- **Party Service as an OAuth 2.0 resource server (🔄 roadmap item):** The Party
  Service currently has no `spring-boot-starter-security` and no `SecurityConfig`
  — it trusts the BFF as its security boundary (ADR-0004). Implementing
  resource-server support would close the gap between ADR-0001's stated design and
  the current implementation. This is tracked on the roadmap.
- **Verifier, authorizer, and escalation decision model** — the Access Control
  design document records these as open questions (how the authorization manager
  decides, who can escalate, what the escalation model looks like).
- **Scope (electorate/region)** — decided **no**; not a requirement.
- **`roles?: string[]` redundancy** — resolved: not a Keycloak attribute; it is the
  PWA's BFF-supplied view, not redundant with realm roles.
- **Manager value: `sub` vs human-readable** — open: the doc currently assumes
  `sub`-as-value; the alternative (human-readable value + `sub` resolution at
  enforcement time) is a real option, especially when federating to Entra ID.

## Related documents

- [ADR-0001](./log.md#adr-0001) — BFF as OAuth 2.0 confidential client
- [ADR-0003](./log.md#adr-0003) — BFF CORS, CSRF, session security
- [ADR-0004](./log.md#adr-0004) — Party Service trusts BFF as security boundary
- [Access Control design document](https://robinyo.github.io/serendipity/docs/
  architecture-guide/access-control/design-document/) — full authorization model,
  roles, enforcement sketch, open questions
- [Identity overview](./index.md) — high-level identity model (two-token model,
  `sub`, no User table)
- [User Provisioning document](https://robinyo.github.io/serendipity/docs/
  administration-guide/user-provisioning/) — attribute schema, how `manager` is
  set, enterprise federation, user profile schema and federation alignment
- [Authentication concept](https://robinyo.github.io/serendipity/docs/concepts/
  authentication/) — authentication concept documentation (Docusaurus)
