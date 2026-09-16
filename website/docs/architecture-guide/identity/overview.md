# Identity (overview)

## Purpose

This document describes how identity works in Serendipity at a conceptual level — who the users are, where their identity lives, what the tokens are, and how the pieces fit together. It is a high-level overview. The details live in two other documents:

- [Access Control design document](../access-control/design-document.md) — the authorization model, roles, token design, enforcement, and the manager hierarchy.
- [User Provisioning](../administration-guide/user-provisioning.md) — how users, their attributes, roles, and groups are created and managed in Keycloak.

## Users

Serendipity's users are humans — salespeople, sales managers, and system administrators. Each human who uses Serendipity has a Keycloak user account in the Serendipity realm. There is **no separate Serendipity-internal User table or entity** — the user is a Keycloak user.

## Identity lives in Keycloak

Keycloak is the identity provider. It authenticates users, issues tokens, and is the source of truth for user identity and (optionally) user attributes.

Keycloak's user model, at a high level:

- **Default managed attributes** — Keycloak's four default user profile attributes, present for every user: `username`, `email`, `firstName`, `lastName`.
- **Core fields** — tracked by Keycloak on the core user model but not configurable profile attributes: `id` (a system-generated UUID — this is the value emitted as `sub` in tokens), `enabled`, `emailVerified`, `createdTimestamp`.
- **Custom attributes** — optional fields added to the user's profile (via the user profile schema, the Admin Console, the Admin API, or import). Serendipity enriches the default schema with attributes such as `manager`, `jobTitle`, `department`, `companyName`, `employeeId`, `employeeType`, `employeeHireDate`.

## Tokens

Two tokens matter for Serendipity:

- **Access token** — what the BFF forwards to the Party Service. It carries `sub` (for identity), `realm_access.roles` (for coarse role checks), and `groups` (for team membership, via a Group Membership mapper). It may also carry user attributes (e.g. `manager`) via a User Attribute mapper. This is the token the Party Service reads for enforcement.
- **ID token** — what carries the full identity attributes: `sub`, `username`, `email`, `firstName`, `lastName`, and any custom attributes. The PWA does **not** have direct access to the token (it only has a session cookie from the BFF); it gets identity and profile information from the BFF.

The stable identifier for a user is **`sub`** — the Keycloak user UUID. It is stable, never reused, and the value used for ownership/assignment comparisons and stored in `ownedBy`/`assignedTo`/`manager`-style references. It is **not** a user profile attribute — it is the system-generated subject claim, emitted in tokens automatically. It is conceptually equivalent to Entra ID's Object ID (`oid`), not to the login name (`username`).

## No Serendipity User table

The access-control model does not use a Serendipity-internal User table. The user is a Keycloak user. The manager hierarchy's `manager` attribute lives on the Keycloak user record as a **custom user attribute** whose value is the manager's `sub`. See the [Access Control design document](../access-control/design-document.md) for the enforcement model and the [User Provisioning](../administration-guide/user-provisioning.md) document for how to set it.

## How the pieces fit together

1. Keycloak authenticates the user and issues an access token and an ID token (the BFF is the OAuth 2.0 confidential client; it gets tokens via the authorization code flow).
2. The BFF maintains a session cookie with the PWA and forwards the access token to the Party Service.
3. The Party Service validates the access token and enforces authorization — roles, ownership, assignment, team membership, and the manager hierarchy — using claims from the access token.
4. The PWA gets role/group info (for UI rendering) and identity/profile info from the BFF (since it does not have the token directly).

The boundary is: Keycloak is the trust boundary for identity; the BFF is the trust boundary for session/cookie; the Party Service is the trust boundary for per-entity authorization. The PWA is not a trust boundary for either.

## Relationship to other documents

- [Access Control design document](../access-control/design-document.md) — the authorization model that the identity model feeds: roles, token design, enforcement, and the manager hierarchy.
- [User Provisioning](../administration-guide/user-provisioning.md) — how to create and manage users, set the `manager` attribute, assign roles and groups, and persist the realm.
- [Keycloak administration guide](../../administration-guide/keycloak.md) — realm and client configuration reference.
