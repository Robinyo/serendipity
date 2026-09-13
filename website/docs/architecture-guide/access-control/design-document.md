# Access Control — Design Document

## Purpose and scope

This document describes the access-control model for Serendipity's core customer-engagement domain — Accounts (Organisations) and Contacts (Individuals) — and how users, groups, and permissions are managed and enforced across the stack.

It is a design document, not an implementation plan. It captures the model, the decisions behind it, and the open questions that implementation must resolve. It assumes Spring Security for enforcement in the Spring Boot services, Keycloak for identity and coarse-grained role/group management, and the BFF as the security boundary for the Angular PWA. Open Policy Agent is out of scope for now.

## Contexts

### Actors

The people who interact with Serendipity fall into a small number of categories, each with different responsibilities and access needs.

- **System Administrator** — the person who operates the platform. Manages users, groups, realms, and the system itself. Full access to all data and all operations. The only role whose permissions cannot be edited.
- **Sales Manager** — a manager of a team of sales people. Can see and act on the entities their team owns or is assigned, can assign and reassign entities to team members, and can create entities on behalf of the team. Also has the manager hierarchy: when enabled, automatically receives read or edit access to records owned by their direct reports, regardless of specific security role depth.
- **Salesperson** — an end user who works with specific accounts and contacts. Owns, is assigned, or is scoped to a subset of entities. Creates and edits the entities they are entitled to.
- **Basic User** — a system-level role. Grants "basic rights" — access to system dashboards and the ability to manage personal preferences. The Basic User role does not grant access to customer-engagement records (Accounts, Contacts, Leads, Opportunities, Activities).
- **Account / Contact Owner** — not a global role; a relationship. A user who owns a specific entity can act on it regardless of their global role (within the bounds of the role model).

### Why this matters

Without a model, each service or endpoint invents its own notion of who can do what, and the Angular PWA, the BFF, the Party Service, and Camunda can drift apart. The model below gives each layer a shared vocabulary: roles, groups, ownership, assignment, scope, and operations.

## Identity model (Keycloak)

Keycloak is the system of record for users. It is authoritative for:

- User accounts (login, credentials, profile attributes).
- Groups (teams, regions, functions).
- Coarse roles (system administrator, sales manager, salesperson, basic user).

### Users

Each human who uses Serendipity has a Keycloak user account. The user's identity in Serendipity is carried by the **ID token** Keycloak issues (and, if needed, the userinfo endpoint) — specifically `sub` (Keycloak user ID), `username`, `email`, `firstName`, `lastName`, and the enriched user attributes (e.g. `manager`, jobTitle). The `sub` is the stable, non-reusable identifier; the `username` may change (e.g. if the user changes their username) and should not be used as the identity for ownership or assignment comparisons.

The access token the BFF forwards to the Party Service also carries `sub` (so the Party Service can do ownership/assignment comparisons) plus the authorization claims — `realm_access.roles` and `groups` — but the full set of identity attributes lives in the ID token, not the access token.

### Groups

Groups represent teams, regions, or functional groupings. Examples:

- `serendipity-admins` — system administrators
- `serendipity-viewers` — read-only users (if a read-only records role is needed; otherwise not used — see the Basic User role for system-level access and the Roles section for the customer-engagement roles)
- `serendipity-team-sydney` — Sydney sales team
- `serendipity-team-melbourne` — Melbourne sales team

Groups are managed in Keycloak. A user belongs to one or more groups. Group membership can be mapped into the access token (as a `groups` claim or mapped to roles), which lets downstream services make group-based decisions without querying Keycloak on every request.

### Roles

Roles are coarse-grained and global — they describe what a user is, not what a user can do to a specific entity. They live in Keycloak as realm roles and are carried in the access token. (See [Authorization model](#authorization-model) for the full role hierarchy and access scope.)

How roles get into the token is described in [Token design](#token-design). In summary:

- **Realm roles** (`realm_access.roles`) carry the coarse role (`system-administrator`, `sales-manager`, `salesperson`, `basic-user`). Realm roles are included in the token by default — no mapper is needed. This is the simplest option and the one to reach for first. Realm roles are chosen over client (resource) roles because the role describes the user's place in the organization, not a privilege on a specific client.
- **Groups** (`groups` claim) carry team membership (e.g. `serendipity-team-sydney`). Groups are **not** in the token by default — a Group Membership mapper must be configured. Groups are used for team-based access, not as a substitute for roles.

The Keycloak role names and the Spring Security authority names are different things. The token carries Keycloak names (`system-administrator`, `sales-manager`, `salesperson`, `basic-user`); the enforcement layer checks Spring Security authorities (`ROLE_SYSTEM_ADMINISTRATOR`, `ROLE_SALES_MANAGER`, `ROLE_SALESPERSON`, `ROLE_BASIC_USER`) via a `JwtGrantedAuthoritiesConverter` or a custom converter. The two naming schemes do not have to match, and they should not be assumed to.

### Groups vs Serendipity-internal assignment

This is an important distinction that the model resolves in favor of Keycloak groups for team membership.

- **Groups in Keycloak answer "which team is this user on."** A group is a collection of users; membership is coarse, managed centrally in Keycloak, and propagates into the access token (once the Group Membership mapper is configured — see [Token design](#token-design)). The Keycloak group name *is* the team name (e.g. the `serendipity-team-sydney` group is the team). There is no separate "team entity" in Serendipity — the group is the team.
- **Serendipity-internal assignment answers "which entity is this user entitled to act on right now."** This is fine-grained, possibly dynamic, stored in the Party Service's data model, and not derived from Keycloak group membership. An entity can be assigned to a user (`assignedTo`) or to a team (`assignedToTeam`) for a purpose that can be audited, time-bounded, or driven by workflow (e.g. a contact assigned to a rep for a follow-up cadence).
- **Keycloak realm roles answer "what is this user's coarse job function."** The role (`system-administrator`, `sales-manager`, `salesperson`, `basic-user`) is global, not per-entity, and is carried in the token's `realm_access.roles` claim.

The model is a hybrid of these three Keycloak concepts, chosen so that team membership and coarse role come from Keycloak (via the token), and per-entity entitlement comes from Serendipity's data model. There is no Serendipity-internal team entity in this model. If Serendipity later needs an internal notion of a team that is distinct from a Keycloak group (e.g. for internal team composition that does not depend on Keycloak), that is an extension — the current model uses Keycloak groups as teams.

## Authorization model

### Roles

Roles are a Keycloak concept — they answer "what is this user's coarse job function." Each Keycloak role is a realm role (not a client role). The chosen roles are four: **System Administrator**, **Sales Manager**, **Salesperson**, and **Basic User**.

The first three are customer-engagement roles — they govern access to records (Accounts, Contacts, Leads, Opportunities, Activities) and the operations that can be performed on them. The fourth, **Basic User**, is a system-level role: it does not govern record access; it grants the user access to system dashboards and the ability to manage their own personal preferences (profile, settings, notification preferences, etc.). A Basic User may or may not also hold one of the customer-engagement roles; the Basic User role and a customer-engagement role are independent.

The roles table:

| Role | Job function | Access scope |
|---|---|---|
| **System Administrator** | Operates the platform; manages users and groups; full, unrestricted access to all records, settings, and customizations. This is the only role whose permissions cannot be edited. | Organization (Global) — any record, any operation. View, edit, delete, assign, export, manage users. The most powerful role; restricted to a few people. Fixed definition; cannot be customized. |
| **Sales Manager** | Manages a team of salespeople; has broader privileges (usually Business Unit or Parent-Child Business Unit depth) to read, modify, assign, or delete sales records managed by team members. Also has the manager hierarchy: when enabled, automatically receives read or edit access to records owned by their direct reports, regardless of specific security role depth. | Business Unit (Local) or Parent-Child Business Unit — the manager's own records, team members' records within scope, and (when the manager hierarchy is enabled) records owned by direct reports. |
| **Salesperson** | Grants basic permissions to create and manage records such as Leads, Opportunities, Accounts, Contacts, and Activities. Typically scoped to User (own records) or Business Unit (team/business-unit records). | User (Basic) or Business Unit (Local) — the salesperson's own records and, if Business Unit scope is granted, records within the business unit. |
| **Basic User** | Grants "basic rights" — access to system dashboards and the ability to manage personal preferences. The Basic User role does **not** grant access to customer-engagement records (Accounts, Contacts, Leads, Opportunities, Activities). It is a system-level role, independent of the customer-engagement roles above. | System-level (not a records scope). The Basic User accesses system dashboards and their own preferences; they do not access the records domain. |

- The Keycloak role names use lower-case, hyphenated, human-readable form — Keycloak's convention — and also appear in the token's `realm_access.roles` claim. Proposed Keycloak role names: `system-administrator`, `sales-manager`, `salesperson`, `basic-user`.
- These are distinct from the Spring Security authority names that the enforcement layer checks: `ROLE_SYSTEM_ADMINISTRATOR`, `ROLE_SALES_MANAGER`, `ROLE_SALESPERSON`, `ROLE_BASIC_USER`. A `JwtGrantedAuthoritiesConverter` (or a custom converter) maps the Keycloak role names to Spring Security authorities, adding the `ROLE_` prefix. The two naming schemes do not have to match, and they should not be assumed to.
- `hasRole("SALES_MANAGER")` in Spring Security checks for the authority `ROLE_SALES_MANAGER` — it adds the `ROLE_` prefix automatically. The same applies to `hasRole("SYSTEM_ADMINISTRATOR")` → `ROLE_SYSTEM_ADMINISTRATOR`, `hasRole("SALESPERSON")` → `ROLE_SALESPERSON`, and `hasRole("BASIC_USER")` → `ROLE_BASIC_USER`.
- Each user may hold the Basic User role alongside a customer-engagement role (or not). The Basic User role is independent — having it does not imply any customer-engagement role, and having a customer-engagement role does not imply Basic User. A user's access to the records domain is governed by their customer-engagement role; their access to system dashboards and preferences is governed by the Basic User role.
- Realm roles are chosen over client (resource) roles because the role describes the user's place in the organization, not a privilege scoped to a specific client. This keeps the role model consistent across all services that validate the same token.

### Ownership

Ownership is a relationship between a user and an entity. If a user owns an entity, the user can act on it within the bounds of their role.

- An entity has an `ownedBy` field — the user ID (Keycloak `sub`) of the owner.
- The owner can view, edit, and delete their own entity (assuming their role permits mutation — ownership does not override the coarse role; a Basic User does not access entities via ownership because Basic User is a system-level role that does not govern the records domain).
- A Sales Manager can act on entities owned by members of their team.
- A System Administrator can act on any entity, regardless of ownership.

Ownership is the primary mechanism for per-user access to entities. It is stored in the Party Service's data model, not in Keycloak. The `ownedBy` claim is a Keycloak user ID, so the Party Service can compare it against the `sub` in the validated access token.

### Assignment

Assignment is broader than ownership. An entity can be assigned to a user or to a team. The assignee can act on the entity within the bounds of their role, even if they do not own it.

- An entity has an `assignedTo` field — the user ID of the assignee.
- An entity can also have an `assignedToTeam` field — the name or ID of a team (which maps to a Keycloak group, e.g. `serendipity-team-sydney`).
- A user can act on an entity assigned to them (by user or by team) within the bounds of their role.
- A Sales Manager can act on entities assigned to their team.
- A System Administrator can act on any entity, regardless of assignment.

Assignment is the mechanism for "I am responsible for this entity even though I don't own it." Examples: a rep is assigned to an account they did not create; a contact is assigned to a rep for a follow-up cadence; a team is assigned a set of contacts for a campaign.

### Teams

A team is a group of users who share responsibility for a set of entities. Teams are represented in Keycloak as groups (e.g. `serendipity-team-sydney`). A Sales Manager is a user who is on the team and has `ROLE_SALES_MANAGER` and the Sales Manager job function. The Sales Manager can act on entities owned by or assigned to any member of their team.

A user can be on more than one team; the enforcement layer checks all of the user's groups (from the token) against both the entity's `assignedToTeam` and the owning user's team. If any of the current user's groups matches, team-based access is granted.

A team is a Keycloak group. The group name is the team name. There is no separate "team entity" in Serendipity — the group is the team, and the group name (e.g. `serendipity-team-sydney`) is stored as the value of `assignedToTeam` on an entity when that entity is assigned to the team.

### Operations

The operations that matter for Accounts and Contacts are:

- **View** — see the entity's data.
- **Create** — create a new entity.
- **Edit** — update an existing entity.
- **Delete** — remove an entity (soft delete, per ADR-0002).
- **Assign / Reassign** — change who the entity is assigned to.
- **Export** — export entity data (read access plus export permission).

### Operation matrix

#### Accounts (Organisations)

| Operation | System Administrator | Sales Manager | Salesperson | Basic User |
|---|---|---|---|---|
| View any account | Yes | No | No | No (system-level role; no records access) |
| View own account | Yes | Yes | Yes | No (system-level role; no records access) |
| View team's account (owned by or assigned to a team member) | Yes | Yes | No | No (system-level role; no records access) |
| Create account | Yes | Yes (on behalf of team) | Yes (owned by self) | No (system-level role; no records access) |
| Edit own account | Yes | Yes | Yes | No (system-level role; no records access) |
| Edit team's account (owned by or assigned to a team member) | Yes | Yes (Sales Manager of the owning/assigned team) | No | No (system-level role; no records access) |
| Edit any account | Yes | No | No | No (system-level role; no records access) |
| Delete own account | Yes (soft) | Yes (soft) | Yes (soft) | No (system-level role; no records access) |
| Delete team's account (owned by or assigned to a team member) | Yes (soft) | Yes (soft) | No | No (system-level role; no records access) |
| Delete any account | Yes (soft) | No | No | No (system-level role; no records access) |
| Assign / reassign | Yes | Yes (within team: to a team member or to the team) | No | No (system-level role; no records access) |
| Export | Yes | Yes (team's) | Yes (owned/assigned) | No (system-level role; no records access) |

#### Contacts (Individuals)

| Operation | System Administrator | Sales Manager | Salesperson | Basic User |
|---|---|---|---|---|
| View any contact | Yes | No | No | No (system-level role; no records access) |
| View own contact | Yes | Yes | Yes | No (system-level role; no records access) |
| View team's contact (owned by or assigned to a team member) | Yes | Yes | No | No (system-level role; no records access) |
| Create contact | Yes | Yes (on behalf of team) | Yes (owned by self) | No (system-level role; no records access) |
| Edit own contact | Yes | Yes | Yes | No (system-level role; no records access) |
| Edit team's contact (owned by or assigned to a team member) | Yes | Yes (Sales Manager of the owning/assigned team) | No | No (system-level role; no records access) |
| Edit any contact | Yes | No | No | No (system-level role; no records access) |
| Delete own contact | Yes (soft) | Yes (soft) | Yes (soft) | No (system-level role; no records access) |
| Delete team's contact (owned by or assigned to a team member) | Yes (soft) | Yes (soft) | No | No (system-level role; no records access) |
| Delete any contact | Yes (soft) | No | No | No (system-level role; no records access) |
| Assign / reassign | Yes | Yes (within team: to a team member or to the team) | No | No (system-level role; no records access) |
| Export | Yes | Yes (team's) | Yes (owned/assigned) | No (system-level role; no records access) |

Notes on the matrix:

- "Yes (team's accounts/contacts)" means the Sales Manager can act on entities owned by or assigned to members of their team. The Sales Manager's team is derived from their Keycloak groups (e.g. the Sales Manager is in `serendipity-team-sydney` and the entity is owned by or assigned to a user who is also in `serendipity-team-sydney`).
- "Owned/assigned" means the Salesperson can act on entities they own or are assigned to (by user or by team).
- The Sales Manager also has the **manager hierarchy** access path: when enabled, a Sales Manager automatically receives read or edit access to records owned by their direct reports (the user they manage), regardless of the direct report's team or the Sales Manager's role depth. The operations allowed on those records follow the Sales Manager's role — so a Sales Manager can view, edit, delete (soft), assign, and export a direct report's records if their Sales Manager role permits those operations, subject to Business Unit scope. The manager hierarchy is set via the `manager` Keycloak user attribute on the user (see [Data model additions](#data-model-additions-suggested)).
- "Soft" means soft delete (set `toDate`), per ADR-0002. Hard delete is not part of this model.
- Ownership does not override the coarse role. A Basic User does not access entities via ownership — Basic User is a system-level role that does not govern the records domain. For the customer-engagement roles, ownership grants access within the permissions of the role: a Salesperson who owns an entity can view and edit it (and delete it, soft), but a Salesperson who does not own or is not assigned to an entity cannot act on it unless they are the Sales Manager of the owning/assigned team or a direct report's manager via the hierarchy.

### Ownership and assignment in the data model

The Party Service's entities currently have a root aggregate `Party` with `publicId`, `type`, and the audit fields. `Individual` and `Organisation` extend `Party` via a shared primary key.

To support ownership and assignment, the model needs to add (or already have) fields that carry:

- `ownedBy` — the Keycloak user ID (`sub`) of the owner.
- `assignedTo` — the Keycloak user ID (`sub`) of the assignee (optional).
- `assignedToTeam` — the team identifier (Keycloak group name) the entity is assigned to (optional).

These are Serendipity-internal fields. They are not Keycloak groups — they are stored in the Party Service's database and populated by the application when entities are created or assigned.

The BFF or the PWA (via the BFF) sets these fields when creating or assigning entities. The Party Service enforces that the caller is entitled to set them — e.g. a Salesperson can set `ownedBy` to their own `sub`, but cannot set it to someone else's `sub`; a Sales Manager can assign an entity to a team member; a System Administrator can assign to anyone.

## Token design

For the authorization model to work, the access token Keycloak issues must carry enough information for the Party Service to make authorization decisions without calling Keycloak on every request.

The token should include:

- `sub` — the Keycloak user ID, the stable, non-reusable identifier for the user. This is the primary identifier for ownership and assignment comparisons; it is the value stored in `ownedBy` and `assignedTo` on the entity. The `sub` is never reused by Keycloak, even if the user changes their username, so it is safe to store as a long-lived reference.
- `username` or `email` — human-readable identity. `username` is one of Keycloak's default managed user attributes (username, email, firstName, lastName); `email` is present if the user has an email address. Use these for display only — not for ownership or assignment comparisons, because usernames can change and email addresses can be updated.
- `realm_access.roles` — the coarse role (`system-administrator`, `sales-manager`, `salesperson`, `basic-user`). Realm roles are included in the token by default — no mapper needs to be configured. This is the simplest option and the one to reach for first. Realm roles (not client roles) are chosen because the role describes the user's place in the organization, not a privilege on a specific client.
- `groups` — the Keycloak groups the user belongs to (e.g. `serendipity-team-sydney`), used for team-based authorization. Groups are **not** in the token by default — you must add a Group Membership mapper to emit them. Without this mapper, every user resolves to the default role, which is the single most common Keycloak configuration mistake.

How these get in the token:

- **Realm roles** — emitted in `realm_access.roles` by default. To restrict which roles appear, configure the role mapper in the client scope (the default `role list` mapper includes all realm roles; a custom mapper can filter).
- **Groups** — add a **Group Membership** protocol mapper to the client's dedicated scope (or to the realm's default client scope). Mapper settings:
  - Mapper type: `Group Membership`
  - Token Claim Name: `groups`
  - Claim JSON Type: `String` (Keycloak emits an array)
  - Full group path: **Off** — use flat group names (`serendipity-team-sydney`, not `/serendipity-team-sydney`). Flat names are simpler for the Party Service to compare against `assignedToTeam`. If you need the path for some reason, turn it on — but the enforcement layer then needs to handle the leading slash.
  - Add to access token: **On** (the Party Service reads the access token)
  - Add to ID token: On or off depending on whether the PWA needs groups (the PWA may want group info for UI rendering)
- **`username`** — the primary login name. Present on the Keycloak user record as one of Keycloak's four default managed attributes (username, email, firstName, lastName). Use it for display only — not for ownership or assignment comparisons, because the username can change. (The enforcement layer uses `sub` for identity, never `username`.)
- **`email`** — added via the Email protocol mapper if needed for display. Not required for authorization.

If the token's groups are very large (a user belongs to many groups), consider limiting the groups claim or using a custom mapper that emits only the relevant groups. For the model as described — a user on one or two teams — the default groups claim is fine.

**User attributes the Party Service needs at enforcement time.** Identity attributes (`username`, `email`, `firstName`, `lastName`) live in the **ID token** — they are for display and profile rendering, not for enforcement. The access token the Party Service reads carries `sub` (for identity), `realm_access.roles`, and `groups` — those are enough for the role, ownership, and assignment checks. The **manager** attribute is the one attribute the manager-hierarchy check needs from the owning user. It is not on the token by default. Two options:

1. **Map `manager` into the access token from the start.** Add a **User Attribute** protocol mapper (mapper type: `User Attribute`, User Attribute: `manager`, Token Claim Name: `manager`, Add to access token: **On**) to the client's scope (or the realm's default client scope). Then the Party Service reads the owning user's `manager` from the token directly — no Keycloak call at enforcement time. (If the owning user is the current user, the current user's token already carries their own `manager`. If the owning user is another user, the enforcement layer must have a way to get *that user's* token — on the current path, the owner's `manager` is on the current user's `ownedByManager` convenience field, which is the mirror of the owner's `manager` attribute stored at entity-creation time. So with option (1) + `ownedByManager` on the entity, the check is a simple comparison against the entity. Without `ownedByManager`, the enforcement layer still needs the owner's token or a Keycloak lookup to read the owner's `manager`.)

2. **Resolve `manager` from Keycloak at enforcement time.** If `manager` is not on the token, the enforcement layer reads the owning user's `manager` attribute from Keycloak (the admin API or a userinfo-style lookup) or from a cached copy. The sketch's `isCurrentUserManagerOfOwningUser` helper uses this option as the default assumption — it reads the owning user's `manager` from Keycloak (or a cache) rather than from the token — because there is no Serendipity `User` entity to read it from, and the owner's `manager` may not be on the current user's token. This is the same tradeoff as `ownedByTeam`: store it on the entity (convenience field) and compare, or look it up.

The choice between (1) and (2) is an implementation decision for the token-to-user resolution. Either way, `manager` is a Keycloak user attribute, not a Serendipity field, and the manager hierarchy does not introduce a Serendipity `User` entity.

The Party Service, once it is an OAuth 2.0 resource server, validates the token and extracts these claims. The realm roles become `GrantedAuthority` instances in Spring Security's `SecurityContext`, mapped from the Keycloak role names to the Spring Security authority names (e.g. `system-administrator` → `ROLE_SYSTEM_ADMINISTRATOR`, `sales-manager` → `ROLE_SALES_MANAGER`, `salesperson` → `ROLE_SALESPERSON`, `basic-user` → `ROLE_BASIC_USER`). The groups become a separate source for team membership checks (the Party Service reads the `groups` claim and checks whether any of them match the entity's `assignedToTeam` or the owning user's team). The `sub` is available as the principal — use `Authentication.getName()` or extract it explicitly from the JWT to get the stable identity.

## Enforcement in the Party Service

Each enforcement point is a complete, self-contained check. All authorization logic for a given operation is encapsulated in one `AuthorizationManager`, registered in the security configuration for the operation's path, and evaluated by Spring Security before the controller method executes. The controller methods do not carry authorization annotations — the authorization is configured in the security layer, aligned with Spring Security's `AuthorizationManager` SPI (the current direction for per-request authorization in Spring Security 6.x, which Spring Boot 4.0.1 uses).

The enforcement layer evaluates role, ownership, assignment, and team membership together; a request is allowed if it passes the checks required for the operation. System Administrators are handled separately: a user with `ROLE_SYSTEM_ADMINISTRATOR` passes every enforcement point without further per-entity checks, because the Organization (Global) access scope grants access to all entities. For non-System-Administrator users, the enforcement layer evaluates the per-entity rules — ownership, assignment, and team membership — in combination. The enforcement sketch at the end of this section shows how these combine in a single manager.

The enforcement layer uses the `sub` claim (the Keycloak user ID) as the stable identity. The `sub` is extracted from the validated JWT by Spring Security's OAuth 2.0 resource server support — it is available as `Authentication.getName()` in the `SecurityContext` after the JWT is validated, and as the JWT's `sub` claim if the code reads it directly from the token. The enforcement layer does not use `username` or `email` as identity, because those can change. See [Token design](#token-design) for the available claims and [Identity model](#identity-model-keycloak) for why `sub` is the stable identifier.

The enforcement layer checks role-based rules via Spring Security's `AuthorizationManager`. The manager checks the current user's authorities (which are the Spring Security authority names — `ROLE_SYSTEM_ADMINISTRATOR`, `ROLE_SALES_MANAGER`, `ROLE_SALESPERSON`, `ROLE_BASIC_USER` — derived from the Keycloak role names by a `JwtGrantedAuthoritiesConverter`, as described in [Roles](#roles)). `hasRole("SYSTEM_ADMINISTRATOR")` in Spring Security's expression language checks for the authority `ROLE_SYSTEM_ADMINISTRATOR` — it adds the `ROLE_` prefix automatically. The same applies to `hasRole("SALES_MANAGER")` → `ROLE_SALES_MANAGER` (Keycloak role `sales-manager`), `hasRole("SALESPERSON")` → `ROLE_SALESPERSON` (Keycloak role `salesperson`), and `hasRole("BASIC_USER")` → `ROLE_BASIC_USER` (Keycloak role `basic-user`). When the manager needs to check the role, it can use `AuthorizationManager#check` with the current authentication, or it can delegate to a `SpelExpressionAuthorizationManager` with `hasRole(...)`. Either way, the check is on the Spring Security authority name, not the Keycloak role name.

1. **Role-based rules** — for operations that only System Administrators can do (e.g. delete any account), the manager checks for `ROLE_SYSTEM_ADMINISTRATOR` and allows immediately. For operations that Sales Managers and System Administrators can do, the manager checks for `ROLE_SALES_MANAGER` or `ROLE_SYSTEM_ADMINISTRATOR`. For operations that Salespersons, Sales Managers, and System Administrators can do, the manager checks for `ROLE_SALESPERSON` or `ROLE_SALES_MANAGER` or `ROLE_SYSTEM_ADMINISTRATOR`. The role check is the first gate; if the user has the required role or is a System Administrator, the manager may allow without further per-entity checks (for System Administrators) or proceed to the per-entity checks (for the specific role).

2. **Ownership-based rules** — the enforcement layer checks whether the current user owns the entity being accessed. Ownership is determined by comparing the current user's `sub` (from the validated JWT) against the entity's `ownedBy` value — the entity is owned by the current user if these are equal. The `ownedBy` field stores the owner's `sub`, not their `username` or `email`, precisely so that ownership survives a username change. Example: the current user's `sub` equals the entity's `ownedBy`. Ownership is checked via the manager's entitlement logic (the manager fetches or receives the entity and compares `ownedBy` to the current user's `sub`).

3. **Assignment-based rules** — the enforcement layer checks whether the current user is assigned to the entity. Assignment is determined by comparing (a) the current user's `sub` against the entity's `assignedTo`, and (b) the current user's groups (from the token) against the entity's `assignedToTeam`. Example: the current user's `sub` equals the entity's `assignedTo`, or the current user is a member of the team named by `assignedToTeam`. Assignment can be user-level (the entity is assigned to a specific user) or team-level (the entity is assigned to a team, and any member of that team can act on it). Assignment to a team is represented by storing the Keycloak group name in `assignedToTeam` — there is no separate "team entity"; the group is the team (see [Teams](#teams)).

4. **Team-based rules** — the enforcement layer checks whether the current user is a member of the team that owns or is assigned the entity. The current user's team membership is derived from their Keycloak groups (from the `groups` claim in the validated token), and the entity's team is derived from its `assignedToTeam` (or, for owned entities, the owning user's group membership — see the note on `ownedByTeam` below). A Sales Manager (`ROLE_SALES_MANAGER`) who is a member of the team can act on team-owned or team-assigned entities. Example: the current user is a member of `serendipity-team-sydney`, and the entity's `assignedToTeam` is `serendipity-team-sydney`, or the entity's `ownedBy` belongs to a user who is also a member of `serendipity-team-sydney`.

5. **No scope-based rules** — scope (electorate/region) is not part of the model. If scope becomes a requirement later, a scope-based rule can be added then.

A sketch of how this looks in Spring Security, using the `AuthorizationManager` SPI:

```java
// Pseudo-code — not a complete implementation.
// One AuthorizationManager per operation (or a shared core with per-operation
// configuration). The manager is registered in the security configuration for the
// operation's path. The controller method does not carry an authorization annotation.
@RestController
public class ContactController {

  @PutMapping("/contacts/{publicId}")
  public ResponseEntity<IndividualModel> update(
      @PathVariable String publicId,
      @Valid @RequestBody IndividualUpdateDto updateDto) {
    // Authorization was checked by the security layer (the manager below)
    // before this method was invoked. If the check failed, a 403 was returned.
    IndividualModel updated = contactService.update(publicId, updateDto);
    return ResponseEntity.ok(updated);
  }
}

// The authorization manager for the update operation.
// It encapsulates the full enforcement: role + ownership + assignment + team +
// manager hierarchy.
@Component
public class ContactEditAuthorizationManager
    implements AuthorizationManager<RequestAuthorizationContext> {

  private final PartyService partyService; // or the repository, depending on design

  @Override
  public void check(Supplier<Authentication> authentication, RequestAuthorizationContext context) {
    Authentication auth = authentication.get();
    if (auth == null) {
      throw new AccessDeniedException("Authentication required");
    }

    String currentSub = auth.getName(); // the 'sub' from the validated JWT

    // System Administrator bypass: a user with ROLE_SYSTEM_ADMINISTRATOR passes every enforcement point.
    if (auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SYSTEM_ADMINISTRATOR"))) {
      return;
    }

    // Extract the path variable (the entity's publicId).
    String publicId = (String) context.getRequest().getPathVariables().get("publicId");

    // Fetch the entity for authorization. (See the note below on pre-check vs.
    // post-fetch and duplicate fetches.)
    Individual contact = partyService.findByPartyPublicId(publicId);
    if (contact == null) {
      throw new AccessDeniedException("Contact not found");
    }

    // Ownership check.
    if (contact.getParty().getOwnedBy().equals(currentSub)) {
      return;
    }

    // Assignment check (user-level): is the current user the assignee of the entity?
    if (contact.getParty().getAssignedTo().equals(currentSub)) {
      return;
    }

    // Assignment check (team-level): is the current user a member of the assigned team?
    List<String> groups = extractGroups(auth); // from the 'groups' claim in the JWT
    if (contact.getParty().getAssignedToTeam() != null
        && groups.contains(contact.getParty().getAssignedToTeam())) {
      // Team-level assignment: any member of the assigned team can act.
      // A Sales Manager on the team can also act (checked below).
      return;
    }

    // Team-based check (owning user's team): is the current user on the team of the
    // user who owns the entity? Requires either an ownedByTeam field on the entity, or
    // a lookup of the owning user's groups. See the note below.
    if (isCurrentUserOnOwningUserTeam(currentSub, contact.getParty().getOwnedBy(), groups)) {
      // The current user is on the owning user's team — check that they have the
      // Sales Manager role to act on owned entities (not all team members can edit
      // another member's entity; only the Sales Manager can, per the model).
      if (auth.getAuthorities().stream()
          .anyMatch(a -> a.getAuthority().equals("ROLE_SALES_MANAGER"))) {
        return;
      }
    }

    // Manager hierarchy check: is the current user the manager (the owning user's
    // `manager` Keycloak user attribute value) of the owning user? If so, the current
    // user has access to the owning user's records (when the manager hierarchy is
    // enabled), regardless of the owning user's team or the current user's role depth.
    // The manager hierarchy is an access path — once the record is reachable via the
    // hierarchy, the Sales Manager's role determines which operations are allowed. See
    // the Manager hierarchy (enforcement) section in Data model additions.
    if (isCurrentUserManagerOfOwningUser(currentSub, contact.getParty().getOwnedBy())) {
      // The current user is the manager of the owning user — check that they have the
      // Sales Manager role to act on the direct report's records. The manager hierarchy
      // grants access to the record; the Sales Manager role determines which operations
      // are permitted (view, edit, delete (soft), assign, export), subject to Business
      // Unit scope.
      if (auth.getAuthorities().stream()
          .anyMatch(a -> a.getAuthority().equals("ROLE_SALES_MANAGER"))) {
        return;
      }
    }

    // A Sales Manager on the assigned team can also edit.
    if (contact.getParty().getAssignedToTeam() != null
        && groups.contains(contact.getParty().getAssignedToTeam())) {
      if (auth.getAuthorities().stream()
          .anyMatch(a -> a.getAuthority().equals("ROLE_SALES_MANAGER"))) {
        return;
      }
    }

    // No rule matched — deny.
    throw new AccessDeniedException("Access denied");
  }

  private List<String> extractGroups(Authentication auth) {
    // Read the 'groups' claim from the validated JWT.
    // Implementation depends on how the JWT claims are exposed (e.g. from the
    // OAuth2User/OAuth2AuthenticatedPrincipal, or from the JWT directly).
    // ...
  }

  private boolean isCurrentUserOnOwningUserTeam(
      String currentSub, String owningUserSub, List<String> currentUserGroups) {
    // If the current user IS the owning user, the owning user's team is the current
    // user's team — trivially true (the current user is on their own team).
    if (currentSub.equals(owningUserSub)) {
      return true;
    }
    // If the current user is NOT the owning user, the owning user's team is not
    // available from the current user's token. Two options:
    //   (1) Store ownedByTeam on the entity (the owning user's team group name), set
    //       when ownership is created or changed. Then: currentUserGroups.contains(
    //       contact.getParty().getOwnedByTeam()).
    //   (2) Look up the owning user's groups (from Keycloak, or from a cached copy) —
    //       an extra call or cache.
    // See the note below. For the sketch, option (1) is assumed.
    return false; // placeholder — replaced by the chosen option
  }

  private boolean isCurrentUserManagerOfOwningUser(
      String currentSub, String owningUserSub) {
    // Returns true if the current user is the manager (the owning user's `manager`
    // Keycloak user attribute value) of the owning user.
    //
    // The owning user's manager is the value of the `manager` attribute on the owning
    // user's Keycloak user record. It is the `sub` of the owning user's manager.
    //
    // Two sources, depending on implementation:
    //   (1) The owning user's `manager` attribute is emitted into the token (as a claim,
    //       or via a User Attribute mapper). In that case the helper reads it from the
    //       token for the owning user (or, if the owning user is the current user, from
    //       the current user's token). The check is:
    //         currentSub.equals(owningUserManagerFromToken(owningUserSub))
    //   (2) The owning user's `manager` attribute is read from Keycloak (or a cached
    //       copy) at enforcement time. The check is:
    //         currentSub.equals(owningUserManagerFromKeycloak(owningUserSub))
    //
    // For the sketch, option (2) is assumed — the helper reads the owning user's
    // `manager` attribute from Keycloak (or a cached copy), because there is no Serendipity
    // `User` entity anymore and the owning user's `manager` may not be on the token.
    // If option (1) is used (e.g. an Owner Attribute mapper emits `manager` into the
    // token), the helper reads it from the token instead.
    //
    // If the entity carries `ownedByManager` as a convenience field (the owning user's
    // `manager` attribute's `sub` at entity creation time), the check is a simple
    // comparison: currentSub.equals(contact.getParty().getOwnedByManager()). That is
    // option (2)'s convenience-field variant.
    //
    // This helper is sketched, not specified — the implementation depends on whether the
    // owning user's `manager` is on the token, on the entity (ownedByManager), or must be
    // fetched from Keycloak. See the Manager hierarchy (enforcement) section in Data model
    // additions.
    return false; // placeholder — replaced by the chosen option
  }
}
```

Notes on the sketch:

- **System Administrator bypass is first.** A `ROLE_SYSTEM_ADMINISTRATOR` user returns early from `check()` without any per-entity work. This matches the model: System Administrators have Organization (Global) access scope and can act on any entity.
- **The manager fetches the entity for authorization.** This is a pre-check: the entity is fetched before the controller method runs. The service layer then fetches it again for business logic. See the note below on the duplicate-fetch tradeoff.
- **`ownedByTeam` and the manager hierarchy are assumed.** The sketch's `isCurrentUserOnOwningUserTeam` checks whether the current user is on the owning user's team; `isCurrentUserManagerOfOwningUser` checks whether the current user is the manager (the `manager` Keycloak user attribute value) of the owning user. These are now two separate, first-class checks in the sketch — not combined — because the manager hierarchy is an independent access path (it does not depend on the owning user's team). For the team check to work without a Keycloak lookup, the entity needs an `ownedByTeam` field (the owning user's team group name). For the manager-hierarchy check, the enforcement layer compares the current user's `sub` against the owning user's `manager` attribute (or the entity carries a convenience `ownedByManager` field). The data model additions section currently lists `ownedBy`, `assignedTo`, and `assignedToTeam` — the manager-hierarchy field is the owning user's `manager` Keycloak user attribute (and, optionally, an `ownedByManager` convenience field on the entity as a mirror of that attribute).
- **`extractGroups` and the owning-user-team / manager-hierarchy logic are sketched, not specified.** The details depend on how JWT claims are exposed to the `AuthorizationManager` (e.g. via the `OAuth2AuthenticatedPrincipal`, or by reading the JWT claims directly). The owning-user-team check and the manager-hierarchy check are the least settled parts of the model — see the data model additions note. The manager-hierarchy check reads the owning user's `manager` Keycloak user attribute (either from the token if a User Attribute mapper emits it, or from Keycloak at enforcement time) — it does not read a Serendipity `User.managedBy` field, because there is no Serendipity `User` entity. The owning-user-team check reads the owning user's groups from the token (or from Keycloak) — it does not read a Serendipity team-membership table, because team membership is Keycloak group membership. For the manager-hierarchy check, the enforcement layer compares the current user's `sub` against the owning user's `manager` attribute (or the entity carries a convenience `ownedByManager` field).

### Design decisions for the enforcement layer

The enforcement layer's shape is determined by a few design decisions, stated here so the implementation follows a deliberate plan rather than defaulting to the simplest thing:

- **Per-operation manager vs. shared manager.** The sketch uses one manager per operation (`ContactEditAuthorizationManager`). An alternative is a single shared manager with per-operation configuration (e.g. a `PartyEntityAuthorizationManager` that takes the operation type and the entity repository, and dispatches to operation-specific rules). The per-operation approach is clearer at the cost of more classes; the shared approach is more compact at the cost of an internal dispatch. Either is valid; the model (the checks) is the same.
- **Pre-check (fetch in the manager) vs. post-fetch (fetch in the service, check after).** The sketch does a pre-check: the entity is fetched during the authorization check, before the controller method. The service layer then fetches the entity again for business logic — a duplicate fetch. A post-fetch approach would have the service layer fetch the entity and then pass it to the authorization check (or the service layer would do the authorization after fetching). The post-fetch approach avoids the duplicate fetch but moves authorization into the service layer (less clean separation). The sketch uses pre-check because it keeps authorization as a pure pre-controller gate (aligned with the `AuthorizationManager` SPI's intended use), but the duplicate-fetch cost is a real consideration for high-throughput operations.
- **Authorization failure → Problem Detail (RFC 7807).** When a manager's `check()` throws `AccessDeniedException`, Spring Security's `AccessDeniedHandler` handles it — typically a 403. The Party Service's error contract (documented in the Party Service component doc) is RFC 7807 Problem Detail (`application/problem+json`). So the implementation needs to ensure that authorization failures produce a Problem Detail response, not a generic 403. This is done either with a custom `AccessDeniedHandler` registered in the security configuration, or by handling `AccessDeniedException` in the Party Service's existing `GlobalExceptionHandler` (but `AccessDeniedException` is usually handled by Spring Security before it reaches `@ControllerAdvice`, so a custom `AccessDeniedHandler` is the more reliable path). The design document does not yet specify the exact mechanism — this is an implementation detail that should be decided when the enforcement layer is implemented.

### What the BFF does not enforce

The BFF enforces authentication (the user is who the token says they are) and relays the token to the Party Service. The BFF does not enforce the per-entity authorization rules — those are the Party Service's responsibility. The BFF may do coarse filtering (e.g. if the user is a Basic User — a system-level role with no records-domain access — the BFF should not forward record-mutation requests to the Party Service, because the Basic User has no entitlements in the records domain), but real enforcement is downstream. The BFF is not a trust boundary for authorization; it is a trust boundary for identity.

### What the Angular PWA does

The PWA shows and hides UI based on the user's roles and groups, derived from the token (if it is a JWT the PWA can decode) or from a BFF user-info endpoint. Concretely:

- If the user is `ROLE_SYSTEM_ADMINISTRATOR`, show the full UI (create, edit, delete, assign, export) and the system administration UI.
- If the user is `ROLE_SALES_MANAGER`, show create, edit, assign, delete (soft), and export for team-scoped entities and for direct reports' records (when the manager hierarchy is enabled); show delete for team-owned entities.
- If the user is `ROLE_SALESPERSON`, show create, edit, delete (soft) for owned/assigned entities; show delete for owned entities.
- If the user is `ROLE_BASIC_USER`, show the system dashboards and the personal preferences UI — the Basic User does not see the records-domain UI (Accounts, Contacts, Leads, Opportunities, Activities).

The PWA never decides "can this user edit this contact." It either knows from the token that the user has the broad role to do so, or it asks the backend and reflects the answer (e.g. an edit button that is only enabled when the backend says it's allowed). The PWA is not a trust boundary.

## Camunda integration

If a workflow acts on an account or contact (e.g. "new contact onboarding," "follow-up cadence," "complaint handling"), the process is started by a user who has permission to do that thing. The enforcement point is the same as for the REST API — the user must be entitled to create or edit the entity before a process that acts on it is started.

Inside Camunda:

- The user who starts the process is identified by the token (or a Camunda-specific token if Camunda uses separate auth).
- Human tasks (e.g. "review new contact," "assign follow-up") are assigned following the same ownership/team/manager-hierarchy model. A task to review a new contact can be assigned to the Sales Manager or the assigned Salesperson.
- Camunda's own permission model (who can see which process definitions, who can claim which tasks) is configured in Camunda, not in Serendipity. To keep them aligned, the same roles and groups from Keycloak should be available to Camunda's authz.

If the Party Service is an OAuth 2.0 resource server and the BFF relays the token to Camunda (where Camunda is configured to accept it), then the token carries the roles and groups to Camunda as well, and Camunda can use them for its own authorization. If Camunda cannot accept the same token, then the roles/groups need to be propagated some other way (e.g. a separate Camunda client with the same Keycloak groups mapped in).

## Data model additions (suggested)

To support the model, the Party Service's entities need to carry fields that represent ownership, assignment, and the manager hierarchy. These fields do not exist in the Party Service's entities today — the current `Party` aggregate has `publicId`, `type`, and the audit fields, but no ownership, assignment, or manager-hierarchy fields. The fields below are additions to the `Party` entity (the root aggregate), so that `Individual` and `Organisation` inherit them. There is no Serendipity-internal User entity — the manager hierarchy's `manager` attribute lives on the Keycloak user record, not on a Serendipity table.

### Party entity additions (root aggregate — inherited by Individual and Organisation)

- `Party.ownedBy` — `String` (Keycloak `sub`), the owner. Not nullable if every entity must have an owner. The value is the Keycloak user ID of the user who owns the entity — a `sub` from Keycloak, not a Serendipity-internal user ID.
- `Party.assignedTo` — `String` (Keycloak `sub`), the assignee. Nullable — not every entity is assigned to a specific user. The value is the Keycloak user ID of the user the entity is assigned to.
- `Party.assignedToTeam` — `String` (Keycloak group name), the team the entity is assigned to. Nullable. The value is the Keycloak group name of the team (e.g. `serendipity-team-sydney`). There is no separate team identifier — the group name is the team identifier.
- **`Party.ownedByManager`** — `String` (Keycloak `sub`), the manager of the owning user (the `sub` stored in the owning user's `manager` Keycloak user attribute, at the time the entity was created or last owned). Nullable — not every entity has a manager (e.g. a System Administrator has no manager). This is a **convenience field**, not a separate concept: it mirrors the owning user's `manager` attribute so that the manager-hierarchy check can be done as a simple comparison against the entity (like `assignedToTeam` mirrors the owning user's team). If the owning user's `manager` attribute changes, this field should be updated (e.g. by a lifecycle hook or a scheduled reconciliation). If the convenience field is not used, the enforcement layer resolves the owning user's `manager` attribute at enforcement time — from the token (if a User Attribute mapper emits it) or from Keycloak (or a cached copy) — the same tradeoff as `ownedByTeam`.

#### Keycloak user attributes (user representation, not a Serendipity table)

The user is represented in Keycloak, not in a Serendipity table. Keycloak's default user attributes (username, email, firstName, lastName) and core fields (id, enabled, emailVerified, createdTimestamp) are present on every user. The Serendipity-relevant enrichment is via **custom user attributes** added to Keycloak's user profile schema, and **the `manager` attribute**, which is the attribute the access-control model depends on.

- **`manager`** — a Keycloak user attribute whose value is the `sub` of the user's manager. Nullable — not every user has a manager (e.g. a System Administrator has no manager; a top-of-hierarchy Sales Manager has no manager). When set, a Sales Manager whose `sub` equals the `manager` attribute of another user receives read or edit access to that user's records (the **manager hierarchy**), regardless of the direct report's team or the Sales Manager's role depth — subject to Business Unit scope and the Sales Manager's role permissions. Only a Sales Manager (or a System Administrator) can be a manager; a Basic User is not a manager, because Basic User is a system-level role that does not govern the records domain. The `manager` attribute is set and maintained in Keycloak (or imported into Keycloak); it is not derived from Keycloak group membership. It is the attribute the manager-hierarchy enforcement check reads.

- **Other enriched attributes (optional, for the PWA / BFF profile):** `jobTitle`, `department`, `companyName`, `employeeId`, `employeeType`, `employeeHireDate` (a date string). These are user attributes in Keycloak. They are profile/display attributes — relevant to the PWA's user profile view and the BFF's profile endpoint, not to access-control enforcement. The PWA does not have direct access to the token; it gets the profile from the BFF, which reads the token's payload (and, if needed, the user's Keycloak attributes via the Keycloak admin API or a userinfo endpoint) and serves them to the PWA.

- **`roles?: string[]` on the PWA's `UserProfile` interface** — this is the PWA's view of the user's roles, supplied by the BFF from the token's `realm_access.roles` (or a flattened/expanded view). It is **not** a Keycloak user attribute, and is not redundant with realm roles — it is the PWA's representation of the realm roles (which the PWA cannot read directly, because the frontend only has a cookie, not the token). The access-control enforcement uses the token's `realm_access.roles` directly; it does not read a `roles` attribute from Keycloak. If the `roles` array in the PWA profile is always just a copy of `realm_access.roles`, it is derived, not stored; whether to keep it on the `UserProfile` interface is a PWA design decision (it may be useful for the PWA's own rendering), but it is outside the access-control enforcement model.

### Manager hierarchy (enforcement)

The manager hierarchy is an access path, not a role. It makes a record **reachable** by the owning user's manager (the user whose `sub` equals the owning user's `manager` Keycloak user attribute value), on the same basis that ownership, assignment, and team membership make a record reachable. Once the record is reachable via the hierarchy, the manager's role (Sales Manager) determines which operations are allowed — so the manager hierarchy + Sales Manager role = the Sales Manager's operations on the direct report's records (view, edit, delete (soft), assign, export), subject to Business Unit scope.

The enforcement check for the manager hierarchy is: **is the current user the `manager` (Keycloak user attribute) of the owning user?**

Since the user representation is now in Keycloak, not in a Serendipity table, the enforcement layer does not look up a Serendipity `User` entity. It reads the owning user's `manager` attribute from the token (if the owning user's `manager` is emitted as a token claim via a User Attribute mapper) or, if the owning user's `manager` is not on the token, from Keycloak at enforcement time (an extra call or a cached copy) — the same convenience-field-vs-lookup tradeoff as `ownedByTeam` and `ownedByManager`.

Two implementations of the enforcement check:

1. **Convenience field on the entity.** `Party.ownedByManager` stores the owning user's `manager` attribute's `sub` value at the time the entity was created or last owned. The check is `currentSub.equals(entity.getOwnedByManager())`. Simple, no extra lookup. Needs maintenance when the owning user's `manager` changes. (Same as before — the entity field is a mirror of the owning user's `manager` attribute, not a separate concept.)

2. **Lookup at enforcement time.** The enforcement layer resolves the owning user's `manager` attribute — from the token if available, or from Keycloak (or a cached copy) if not — and checks `currentSub.equals(owningUserManager)`. No field to maintain on the entity, but a dependency on the token or Keycloak. This is the option sketched below in the enforcement sketch: the helper `isCurrentUserManagerOfOwningUser` reads the owning user's `manager` value (from the token or from Keycloak) rather than from a Serendipity `User.managedBy` field — because there is no Serendipity `User` entity anymore.

The enforcement sketch in this document uses the `manager` Keycloak user attribute as the source of the owning user's manager, via a `isCurrentUserManagerOfOwningUser(currentSub, owningUserSub)` helper. The helper's implementation reads the owning user's `manager` attribute — either from the token (if a User Attribute mapper emits it) or from Keycloak at enforcement time. The sketch does not specify which; that is an implementation detail for the BFF/Party Service token-to-user resolution.

The manager hierarchy is enabled by default when the owning user's `manager` attribute is set. There is no separate "manager hierarchy enabled" flag — if the owning user's `manager` attribute is set, the hierarchy applies. If the organization wants to disable the hierarchy for a particular entity or user, it clears the owning user's `manager` attribute (and, if `ownedByManager` is on the entity, clears it too).

## Open questions

These are decisions that implementation must resolve, not assumptions this document makes:

1. **Do you want group-based team access in the token?** Decided: yes. Keycloak groups (`groups` claim) carry team membership (e.g. `serendipity-team-sydney`). A Group Membership mapper must be configured to emit them (groups are not in the token by default). Flat group names (full path off) are simpler for the enforcement layer. This is the chosen approach; Serendipity-internal team membership is not used.

2. **Is scope (electorate/region) a real requirement?** Decided: no. Scope-based access is not part of the model and is not assumed by default. It is an extension if it becomes a requirement later.

3. **Do you want OPA later?** Possibly, but not now. This document assumes Spring Security + Keycloak. If OPA is introduced later, the enforcement layer changes (the Party Service asks OPA "can this user edit this contact?"), but the model (roles, ownership, assignment, teams) stays the same. OPA would evaluate it; it would not redefine it. OPA is out of scope for now.

4. **What are the exact roles?** Decided: four roles — **System Administrator**, **Sales Manager**, **Salesperson**, and **Basic User** — as Keycloak realm role names (lower-case, hyphenated, per Keycloak convention: `system-administrator`, `sales-manager`, `salesperson`, `basic-user`). These map to Spring Security authorities `ROLE_SYSTEM_ADMINISTRATOR`, `ROLE_SALES_MANAGER`, `ROLE_SALESPERSON`, `ROLE_BASIC_USER` via a `JwtGrantedAuthoritiesConverter` or custom converter. Realm roles (not client roles). The first three are customer-engagement roles (they govern access to records and the operations that can be performed on them); the fourth, Basic User, is a system-level role (system dashboards and personal preferences — no records-domain access). A user may hold the Basic User role alongside a customer-engagement role, or not — the two are independent. Keycloak group membership is used for team-based access. One coarse customer-engagement role per user (Basic User may be held in addition). See the [Roles](#roles) section for the full role table with job function and access scope, and the [Manager hierarchy](#manager-hierarchy-enforcement) subsection of [Data model additions](#data-model-additions-suggested) for the manager-hierarchy access path.

5. **How does assignment happen?** Not decided. Is it done by the user (self-assignment), by a Sales Manager, by a System Administrator, or by workflow (e.g. a Camunda process assigns a follow-up task to a Salesperson)? The enforcement must allow the appropriate callers to set `assignedTo` and `assignedToTeam`. This is an implementation decision.

6. **Do you want a Serendipity-internal user/team management UI?** Or is all user/group/role management in Keycloak? The model assumes Keycloak for identity and coarse roles, with Serendipity carrying ownership and assignment. If you want a Serendipity UI for managing users and teams, that's an additional feature on top of this model.

## What is out of scope

- Open Policy Agent — deferred.
- Fine-grained attribute-based access control beyond roles, ownership, assignment, teams, and scope.
- Data retention, archival, and hard delete beyond the soft-delete model (ADR-0002).
- Camunda's internal permission model in detail — only the integration points are covered.
- Multi-tenancy — the model assumes a single tenant for now.
- Public / versioned API for external consumers — the model covers the BFF-mediated path. If a public API is added, the access-control model for that path is a separate design.
