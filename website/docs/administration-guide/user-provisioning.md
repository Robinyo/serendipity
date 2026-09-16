# User Provisioning

## Purpose

This document describes how users are provisioned and managed in Keycloak for Serendipity — currently via **manual creation in the Keycloak Admin Console**. It covers the user schema (default attributes, core fields, custom attributes), how to set the `manager` attribute, how to assign roles and groups, and how realm export/import keeps the configuration persistent across container restarts.

It complements:

- [Keycloak administration guide](./keycloak.md) — realm and client configuration (create a realm, create a client, configure the BFF).
- [Access Control design document](../architecture-guide/access-control/design-document.md) — the model that drives the attribute, role, and group requirements.
- [Keycloak user profile schema and federation alignment](#keycloak-user-profile-schema-and-federation-alignment) — how custom attributes are defined and mapped when federating with a directory such as MS Entra ID.

## Manual provisioning (current approach)

Users are created manually in the Keycloak Admin Console. For each human who needs to use Serendipity:

1. Select the Serendipity realm.
2. Create a user: **Users** → **Create new user**.
3. Set the required fields: `username`, `email` (with **Email verified** enabled), `firstName`, `lastName`.
4. Set a password: **Credentials** tab → **Set password**. Disable the **Temporary** toggle if the user should not be forced to change the password on first login.
5. Optionally set custom attributes (see the schema below).
6. Assign realm roles and groups.

## User schema

### Default managed attributes

These are Keycloak's four default user profile attributes — present for every user:

| Attribute | Notes |
|---|---|
| `username` | The primary login name — what the user types to sign in. Stable until changed. Not used for ownership/assignment comparisons (the enforcement layer uses `sub`). |
| `email` | The preferred email address. |
| `firstName` | Given name. |
| `lastName` | Surname / family name. |

### Core fields (not profile attributes)

These are tracked by Keycloak on the core user model but are not configurable profile attributes:

| Field | Notes |
|---|---|
| `id` | The system-generated UUID. This is the value emitted as `sub` in tokens. Stable, never reused. Do not edit. This is the value you copy into the `manager` attribute of a direct report. |
| `enabled` | Whether the account is active. |
| `emailVerified` | Whether the email has been verified. |
| `createdTimestamp` | When the user was created. |

### Custom attributes (Serendipity-enriched)

These are added to the user's profile as custom attributes. They are part of the realm's **User Profile** (the user profile schema) — they are **defined in the realm**, not created automatically when a federation is initiated. They are added to the user's **Attributes** tab in the Admin Console (or via the Admin API, or via import).

| Attribute | Value | Notes |
|---|---|---|
| `manager` | The `sub` (UUID) of the user's manager | The one attribute the access-control model depends on — it enables the manager hierarchy: a Sales Manager whose `sub` equals the `manager` attribute of another user receives access to that user's records (subject to role and scope). If a user has no manager, leave this unset. The value must be the manager's `sub`, not their `username` or `email` — those can change, and the enforcement layer compares `currentSub` against the owning user's `manager` attribute value directly. See **Setting the `manager` attribute** below. |
| `jobTitle` | A string | Optional profile attribute. Not used for enforcement. |
| `department` | A string | Optional profile attribute. Not used for enforcement. |
| `companyName` | A string | Optional profile attribute. Not used for enforcement. |
| `employeeId` | A string | Optional profile attribute. Not used for enforcement. |
| `employeeType` | A string | Optional profile attribute. Not used for enforcement. |
| `employeeHireDate` | A date string (ISO date) | Optional profile attribute. Not used for enforcement. |
| `directoryObjectId` | The Entra ID Object ID of the user | Optional. Only relevant when federating with Microsoft Entra ID and the directory wants to correlate to, or re-hydrate from, the Entra ID object. Additive to the model — does not change the `sub`-as-identity rule or the `manager`-as-`sub` rule. |

**Note on `roles`:** `roles?: string[]` is **not** a user attribute to be set in Keycloak. It is the PWA's view of the user's realm roles, supplied by the BFF. Realm roles are assigned in Keycloak (see **Roles** below), not stored as a user attribute.

## Setting the `manager` attribute

The `manager` attribute stores the manager's `sub` (Keycloak UUID). To set it:

1. Identify the manager's Keycloak `sub`. Open the manager's user in the Admin Console → **Details** tab → copy the `id` field. The `id` is the UUID you need.
2. Open the direct report's user in the Admin Console.
3. Go to the **Attributes** tab.
4. Add an attribute with **Key** = `manager` and **Value** = the manager's `sub` (the UUID copied in step 1).
5. Click **Save**.

Today, this is done manually in the Admin Console's **Attributes** tab. For each direct report, the administrator opens the manager's user to copy their `id` (the `sub`), then opens the direct report's user and adds the `manager` attribute with that value. For a small team this is workable; for a larger team it becomes repetitive — each direct report requires its own copy-from-one-user-paste-into-another step, and the Admin Console does not offer a "look up the manager by username and store their `sub`" — the attribute value is just a string the administrator enters or copies.

If the direct report has no manager (e.g. a System Administrator, or a top-of-hierarchy Sales Manager), leave the `manager` attribute unset — do not add it.

**Finding a user's `sub` in the Admin Console.** The `sub` is not labeled "sub" in the Admin Console. It is the `id` field on the user's **Details** tab. That is the UUID you copy into the `manager` attribute.

**If the manager changes.** When a user's reporting line changes, update the direct report's `manager` attribute to the new manager's `sub`. (If the implementation uses a `Party.ownedByManager` convenience field on the entity, that field would also need to be updated or reconciled — but that is an entity/implementation concern, not a Keycloak provisioning concern.)

## Roles

Roles in Serendipity are **Keycloak realm roles**. They are coarse-grained and describe what the user is, not what the user can do to a specific entity.

| Role (Keycloak name) | Job function | Access scope |
|---|---|---|
| `system-administrator` | System Administrator | Organization (Global) — unrestricted, non-editable role. Passes every enforcement point. |
| `sales-manager` | Sales Manager | Business Unit or Parent-Child depth; can manage team members' records via the manager hierarchy. |
| `salesperson` | Salesperson | Basic — owned/assigned entities. |
| `basic-user` | Basic User | System-level — system dashboards and personal preferences; no records-domain access. |

To assign a role: open the user → **Role mapping** tab → **Assign role** → search for the realm role by name (e.g. `sales-manager`).

Realm roles are included in the access token by default, in `realm_access.roles` — no mapper is needed for them to reach the Party Service. No Client roles are used; roles are realm-level because they describe the user's place in the organization, not a privilege on a specific client.

A user may hold the `basic-user` role alongside a customer-engagement role, or not — the two are independent. `basic-user` is a system-level role; it does not govern the records domain. A Basic User cannot be a manager (the manager hierarchy is a Sales Manager / System Administrator concept).

## Groups (teams)

Groups represent teams. Team membership is the basis for team-based authorization.

Examples: `serendipity-team-sydney`, `serendipity-team-melbourne`. The group name **is** the team name — there is no separate team entity in Serendipity.

To add a user to a group: open the user → **Groups** tab → **Add group** → search for the group name.

**Groups are not in the access token by default.** To have them reach the Party Service, a **Group Membership** protocol mapper must be configured on the client's scope (or the realm's default client scope). Without it, the Party Service cannot see team membership and every user resolves to the default role — the single most common Keycloak configuration mistake. See the [Access Control design document](../architecture-guide/access-control/design-document.md)'s token design section for mapper settings.

## Persistence — realm export/import

Keycloak's database does not persist across container restarts unless you export/import the realm. For development, use the realm export/import flow described in the [Keycloak administration guide](./keycloak.md):

- Export the realm (with users) to `backend/services/identity-service/export/serendipity-dev-realm.json`.
- Import at container startup from `backend/services/identity-service/import/`.
- After creating or editing users in the Admin Console, export again and replace the import file, or edit the import file by hand and re-import.

This means users, custom attributes (including `manager`), roles, and groups you create in the Admin Console are persisted across restarts **only if** you export/import. For a dev setup, the import file is the source of truth for the dev realm's users.

## Enterprise deployment — federation to MS Entra ID

In an enterprise deployment, users are typically not created manually. The common approach is to configure Keycloak to federate with **Microsoft Entra ID** (formerly Azure AD) via **User Federation** (Keycloak's Entra ID / LDAP-style connector) or via **Identity Provider (IDP) federation** (OIDC/SAML brokering).

**User Federation** — Keycloak connects to Entra ID as a user storage provider, imports (or on-demand syncs) users, and maps Entra ID attributes into Keycloak's user model. Entra ID already has the reporting-line relationship (e.g. the manager's Entra ID Object ID is available through the `manager` attribute on the user object in Entra ID). At federation/import time, that reporting-line information can be mapped into the Serendipity `manager` attribute — but the mapping is a data-mapping decision: the value stored is the manager's **Keycloak `sub`** (not the Entra ID Object ID), so the import process must map "manager's Entra ID Object ID" → "manager's Keycloak `sub`" (or store the Entra ID Object ID in a separate attribute and resolve at enforcement time, same tradeoff as the `ownedByTeam` lookup option). The `sub` is Keycloak's own stable identifier for the user; it is the value used for ownership/assignment and for the `manager` attribute value, and it is distinct from the Entra ID Object ID.

**Identity Provider (IDP) federation** — users authenticate against Entra ID via OIDC/SAML brokering. Keycloak issues its own `sub` to the federated user (Keycloak's own UUID, not the Entra ID Object ID). The reporting-line information is not automatically part of the brokering flow unless it is carried in the upstream token and mapped into a Keycloak user attribute at (re)authentication/import time.

In either case, the current-state rule still applies: the `manager` attribute stores the manager's **Keycloak `sub`**, and a user with no manager leaves it unset. What changes in an enterprise deployment is *how* that value gets populated — not the model. For an initial enterprise rollout, the path is typically: federate/import users from Entra ID (user attributes including the reporting line are mapped), accept or customize the attribute mapping so that the Serendipity `manager` attribute receives the correct value, then validate that the manager hierarchy works by testing a Sales Manager against a direct report's records.

If the enterprise environment wants to **correlate** to the Entra ID Object ID (e.g. for reporting, exports, or re-hydration from the directory), a separate custom user attribute (e.g. `directoryObjectId`) can be added to the Keycloak user profile to store the Entra ID Object ID alongside the Serendipity `manager` attribute. That is additive to the model — it does not change the `sub`-as-identity rule or the `manager`-as-`sub` rule.

## Keycloak user profile schema and federation alignment

**Custom attributes are defined in the realm, not auto-created by federation.**

Keycloak's custom user attributes (`manager`, `jobTitle`, `department`, `companyName`, `employeeId`, `employeeType`, `employeeHireDate`, and, optionally, `directoryObjectId`) live in the realm's **User Profile** — the user profile schema. They are **managed attributes** defined in the realm, not attributes that Keycloak creates automatically when a federation is initiated. Federation (User Federation or IDP federation) maps upstream values into Keycloak's user model; the upstream attribute is mapped to a Keycloak attribute that must already exist (or that Keycloak treats as an unmanaged attribute and applies the realm's unmanaged-attribute policy to). The recommended approach is to define the custom attributes in the realm's user profile schema first, then configure the federation mapper to map the upstream value into the defined Keycloak attribute.

Defining the attributes first means they are managed (not unmanaged), which gives you control over whether they are optional or required, read-only or editable, and lets you apply validations (e.g. a regex). For the `manager` attribute, a validation is useful regardless of how the value gets populated — it can catch a malformed value whether it was entered manually in the Admin Console or mapped from an upstream source.

**Attribute names can align with Entra ID.**

Entra ID's user object carries a `manager` attribute (a reference to the manager — the manager's Entra ID Object ID, or the manager's DN depending on how it is accessed). Naming the Keycloak attribute `manager` aligns with the upstream attribute name and makes the federation mapping self-documenting — a reasonable default. The same alignment applies to the other attributes where a clear upstream analogue exists (e.g. Entra ID's `jobTitle` → Keycloak's `jobTitle`).

**Attribute name alignment does not solve the value mapping — that is a separate decision.**

Even with both sides named `manager`, the values differ in a way the federation mapping must handle:

- Entra ID's `manager` carries the manager's **Entra ID Object ID** (or DN). Serendipity's model wants the manager's **Keycloak `sub`**. The federation mapper that maps the upstream `manager` into Keycloak's `manager` attribute must therefore produce a Keycloak-`sub`-valued `manager` attribute — which requires the import process to know, for the manager's Entra ID Object ID, which Keycloak user that is and what their `sub` is. One way to enable that lookup is to also map the upstream Entra ID Object ID into a separate Keycloak custom attribute (e.g. `directoryObjectId`) on each user, so the import process can resolve "which Keycloak user has this Entra ID Object ID as their `directoryObjectId`, and what is their `sub`?" and write that `sub` into the direct report's `manager` attribute. Alternatively, the federation mapper can be configured to write the Entra ID Object ID (or DN) into Keycloak's `manager` attribute and the enforcement layer resolves it to a `sub` at enforcement time — the same tradeoff as the `ownedByTeam` lookup option.

- The `sub` is Keycloak's own stable identifier for the user (its own UUID), distinct from the Entra ID Object ID. It is the value the access-control model uses for `ownedBy`, `assignedTo`, and the `manager` attribute value. The reporting line from Entra ID is the starting point, but the value that ends up in Keycloak's `manager` attribute must be the Keycloak `sub` if the model uses sub-as-value — or the Entra ID Object ID if the model uses resolve-at-enforcement-time. That choice is made in the federation mapper configuration (and is the same decision as the enterprise-deployment section above).

**For an initial enterprise rollout with federation, the typical sequence is:**

1. Define the custom attributes in the realm's user profile schema — `manager` (optional), `jobTitle`, `department`, `companyName`, `employeeId`, `employeeType`, `employeeHireDate`, and, if correlation to the Entra ID Object ID is wanted, `directoryObjectId` (optional). Configure validations as needed.
2. Configure the federation (User Federation or IDP federation), including the attribute mappings — upstream Entra ID attribute → Keycloak attribute. For `manager`, decide whether the mapped value is the resolved Keycloak `sub` (option a) or the upstream Entra ID Object ID (option b).
3. Federate/import users. Accept or customize the attribute mappings so that each user's `manager` attribute receives the correct value (the manager's Keycloak `sub` under option a, or the manager's Entra ID Object ID under option b).
4. Validate the manager hierarchy — a Sales Manager should be able to access a direct report's records, and a user with no manager (e.g. a System Administrator or a top-of-hierarchy Sales Manager) should leave `manager` unset.

**What this does not change.** The Serendipity model and the `manager`-as-`sub` rule are unchanged by federation. Federation changes *where the value comes from and how it is mapped*, not *what the value means*. The enforcement layer still reads `currentSub` against the owning user's `manager` attribute value (option a) or resolves it (option b), and a user with no manager leaves `manager` unset, in development or in an enterprise deployment.

## What this document does not cover

- Bulk or automated provisioning (LDAP/Active Directory sync, HR system import, SCIM) — future work if manual provisioning is insufficient for the organization's scale. (The Enterprise deployment and Keycloak user profile schema sections above cover the federation case; this bullet refers to other bulk/automated approaches.)
- Password policy, MFA, and authentication flows — configure in the realm's **Authentication** and **Login** settings (Keycloak administration guide).
- Client, role, and scope configuration for the BFF — Keycloak administration guide.
- The enforcement model and how the tokens are used by the Party Service — [Access Control design document](../architecture-guide/access-control/design-document.md).

## References

- Keycloak Server Administration Guide — [Managing users](https://www.keycloak.org/server/manage-users), [User profile](https://www.keycloak.org/docs/latest/server_admin/index.html#user-profile), [Managing attributes](https://www.keycloak.org/docs/latest/server_admin/index.html#managing-attributes), [Roles](https://www.keycloak.org/server/rbac), [Groups](https://www.keycloak.org/server/manage-groups).
- [Access Control design document](../architecture-guide/access-control/design-document.md) — the model that drives the attribute, role, and group requirements.
- [Keycloak administration guide](./keycloak.md) — realm and client configuration reference.
