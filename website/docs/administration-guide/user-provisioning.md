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

## LDAP-based provisioning with LDIF (development)

The development path for automated, file-driven user provisioning uses **LDIF** (LDAP Data Interchange Format) loaded into an **OpenLDAP** directory server, with Keycloak's **LDAP User Federation** importing (or on-demand syncing) the users from that directory into the Serendipity realm. This is the automated, file-driven alternative to creating users one-by-one in the Keycloak Admin Console, and it gives you a repeatable, version-controllable sample organisation you can load, inspect, and reload.

### Why LDIF + OpenLDAP for development

- **Version-controlled users.** The sample users, their attributes, their reporting line, and their geographic attributes all live in a single LDIF file (`backend/services/openldap/sample-data/au/shane-longman.ldif`) that is part of the repo. You edit the file, reload it, and the directory reflects the change — no Admin Console copy-paste.
- **Geographic attributes as first-class LDAP attributes.** Standard LDAP attributes `c` (country, `countryName`), `l` (locality / city), and `st` (state or province) carry the user's geographic attributes directly in the directory entry; they are then mapped into Keycloak's user profile at federation time. At this point these geographic attributes are for reporting and filtering only — they do **not** gate access to records (the access-control model uses `manager` (Keycloak `sub`), roles, and `ownedBy`/`assignedTo`). If geographic access-control scope becomes a requirement later, it can be added then.
- **Relationship attributes for the reporting line.** The LDAP `manager` attribute (a standard LDAP relationship attribute) holds the manager's LDAP DN. This is the natural way to represent a reporting line in LDAP — a user entry references its manager's entry by DN. The LDIF does **not** store the manager's Keycloak `sub` in the LDAP `manager` attribute; that would be non-standard LDAP and would defeat the purpose of using an LDAP directory as the source of truth. Instead, the import-time resolver resolves the LDAP DN → the manager's Keycloak `sub` (see **Import-time resolution** below).
- **No strict groups or deep tree required.** The sample avoids strict groups or a deep org tree in the directory. Geographic attributes live on the user profile itself (`c`, `l`, `st`), and the reporting line is a flat `manager` DN reference. If you later want team groups in the directory (e.g. `ou=teams,ou=serendipity` with member DNs), the same federation can map them into Keycloak groups.

### The sample LDIF

The sample is defined in `backend/services/openldap/sample-data/au/shane-longman.ldif`. It creates:

- A `dc=serendipity,dc=org` DIT with `ou=people` and `ou=groups` branches.
- **16 users**:
    - 1 System Administrator (`uid=system`) — top of hierarchy, no `manager` attribute.
    - 2 managers (`uid=carl.smith` — Sales Director; `uid=jane.chen` — Sales Manager, Sydney; `uid=rafael.okonkwo` — Account/Usage Manager, Melbourne). Carl and Jane report to Carl; Rafael reports to Carl. (Note: in the sample, Carl is the top manager; Jane and Rafael report to Carl. The `manager` attribute on Jane and Rafael holds Carl's LDAP DN.)
    - 13 direct reports across Sydney, Melbourne, Brisbane, Adelaide and Perth — salespeople and a usage analyst, all reporting to either Jane Chen or Rafael Okonkwo.
- **Attribute conventions:**
    - `uid` — login name (Keycloak pairs `uid` with `cn` to form the display name).
    - `cn`, `givenName`, `sn` — common name, given name, surname.
    - `title` — job / functional title (e.g. "Sales Manager — Sydney", "Salesperson — Brisbane").
    - `department` — functional department (e.g. "Sales", "Usage / Accounts").
    - `mail` — email address.
    - `telephoneNumber` — phone.
    - `manager` — **the manager's LDAP DN** (standard LDAP relationship attribute). For example, a direct report of Jane Chen has `manager: uid=jane.chen,ou=people,dc=serendipity,dc=org`. This is **not** the manager's Keycloak `sub`.
    - `directoryObjectId` — the **user's own LDAP DN** (e.g. `uid=jane.chen,ou=people,dc=serendipity,dc=org`). This is the source-correlation attribute mapped into Keycloak's `directoryObjectId` custom attribute at federation. For the OpenLDAP case, `directoryObjectId` holds the LDAP DN (the upstream directory object identifier), analogous to how it holds the Entra ID Object ID for the Entra ID federation case. The role of `directoryObjectId` is the same in both cases: it lets the import process correlate a local user to the upstream directory object, and (for the manager resolution) look up which user owns a given manager DN.
    - `<name>SerendipitySub` — a pre-computed Keycloak `sub` (UUID) for each user, stored as a user-specific attribute (e.g. `janeChenSerendipitySub: 8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d`). These are used at import time to resolve each direct report's LDAP `manager` DN → the manager's Keycloak `sub`. For example, when the import process reads a direct report whose `manager` attribute is `uid=jane.chen,ou=people,dc=serendipity,dc=org`, it looks up the user whose `directoryObjectId` matches that DN, reads that user's `janeChenSerendipitySub`, and writes that UUID into the direct report's Keycloak `manager` attribute.
    - `c`, `l`, `st` — geographic attributes (`c` = country, `l` = locality/city, `st` = state/province). For example, a Brisbane user has `c: AU`, `l: Brisbane`, `st: QLD`. These are the standard LDAP geographic attributes; they map directly into Keycloak user attributes at federation time (assuming the federation mapper is configured to include them).
    - `employeeType` — an optional functional type (e.g. "salesperson", "usage-analyst") for filtering/reporting.

- **Sample users table (LDIF → Keycloak):** The sample is defined in `backend/services/openldap/sample-data/au/shane-longman.ldif`.

| uid | cn | title | department | manager (LDAP DN) | resolved KC sub (who the manager is) | city | state | employeeType |
|---|---|---|---|---|---|---|---|---|
| `system` | System Account | System Account | System | *(none — top of hierarchy)* | *(none)* | Melbourne | VIC | — |
| `carl.smith` | Carl Smith | Sales Director | Sales | *(none — top of hierarchy)* | *(none)* | Melbourne | VIC | — |
| `jane.chen` | Jane Chen | Sales Manager — Sydney | Sales | `uid=carl.smith,ou=people,dc=serendipity,dc=org` | `4f5a1c2e-3b6d-4a7e-9c01-2d3f4a5b6c7d` (Carl Smith) | Sydney | NSW | — |
| `rafael.okonkwo` | Rafael Okonkwo | Account / Usage Manager — Melbourne | Usage / Accounts | `uid=carl.smith,ou=people,dc=serendipity,dc=org` | `4f5a1c2e-3b6d-4a7e-9c01-2d3f4a5b6c7d` (Carl Smith) | Melbourne | VIC | — |
| `marcus.nguyen` | Marcus Nguyen | Salesperson — Sydney | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Sydney | NSW | salesperson |
| `priya.patel` | Priya Patel | Salesperson — Sydney | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Sydney | NSW | salesperson |
| `liam.omalley` | Liam O'Malley | Salesperson — Melbourne | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Melbourne | VIC | salesperson |
| `david.kim` | David Kim | Salesperson — Melbourne | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Melbourne | VIC | salesperson |
| `lee.smith` | Lee Smith | Salesperson — Brisbane | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Brisbane | QLD | salesperson |
| `tanya.rao` | Tanya Rao | Sales Executive — Sydney | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Sydney | NSW | salesperson |
| `aisha.bello` | Aisha Bello | Usage Analyst — Melbourne | Usage / Accounts | `uid=rafael.okonkwo,ou=people,dc=serendipity,dc=org` | `c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f` (Rafael Okonkwo) | Melbourne | VIC | usage-analyst |
| `zoe.watson` | Zoe Watson | Sales Executive — Melbourne | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Melbourne | VIC | salesperson |
| `nick.park` | Nick Park | Sales Executive — Brisbane | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Brisbane | QLD | salesperson |
| `sam.wilson` | Sam Wilson | Sales Executive — Adelaide | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Adelaide | SA | salesperson |
| `ella.martinez` | Ella Martinez | Sales Executive — Perth | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Perth | WA | salesperson |
| `sunrise.nurse` | Sunrise Nurse | Salesperson — Brisbane | Sales | `uid=jane.chen,ou=people,dc=serendipity,dc=org` | `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen) | Brisbane | Queensland (full-name form, not QLD — see note) | salesperson |

**Edge case — inconsistent state representation.** The `sunrise.nurse` entry uses `st: Queensland` (the full state name) instead of the 2-letter code `QLD` used by the other Australian users. This is an intentional edge case to test how consumers handle inconsistent state representations. The decision of whether to normalize to the 2-letter code in the LDIF (or in the application) is left open — the sample documents both forms. For a consistent sample, change `st: Queensland` to `st: QLD`.

### OpenLDAP setup (development)

For the development setup, run an OpenLDAP container with the `serendipity` backend:

```bash
# Example: osixia/openldap with the serendipity DIT pre-configured
docker run -d --name serendipity-openldap \
  -p 389:389 \
  -e LDAP_ORGANISATION="Serendipity" \
  -e LDAP_DOMAIN="serendipity.org" \
  -e LDAP_ADMIN_PASSWORD="admin" \
  -e LDAP_BACKEND_PASSWORD="admin" \
  osixia/openldap:1.5.0
```

This gives you an OpenLDAP server at `ldap://localhost:389` with a `dc=serendipity,dc=org` base. The sample LDIF is then loaded into it (see **Loading the sample LDIF** below).

For a more complete development setup (with the BFF, the identity service, and Keycloak), refer to the project's Docker Compose / backend configuration. The key point for this section is that OpenLDAP is available and accessible to Keycloak's LDAP User Federation connector.

### Loading the sample LDIF

Use `ldapmodify` (or `ldapadd`) to load the LDIF into OpenLDAP:

```bash
ldapmodify -x \
  -H ldap://localhost:389 \
  -D "cn=admin,dc=serendipity,dc=org" \
  -w admin \
  -a -f backend/services/openldap/sample-data/au/shane-longman.ldif
```

The `-a` flag tells `ldapmodify` to treat the input as an add-only LDIF (no modifications or deletes). If you're reloading the sample (e.g. after editing it), you may want to first clear the `ou=people` and `ou=groups` branches, or use a fresh container.

You can verify the load with `ldapsearch`:

```bash
ldapsearch -x \
  -H ldap://localhost:389 \
  -D "cn=admin,dc=serendipity,dc=org" \
  -w admin \
  -b "ou=people,dc=serendipity,dc=org" \
  "(objectClass=inetOrgPerson)" \
  dn cn mail title department manager c l st directoryObjectId
```

This returns each user's DN, common name, email, title, department, manager DN, geographic attributes, and `directoryObjectId`.

### Keycloak LDAP User Federation configuration

In Keycloak's Admin Console, for the Serendipity realm:

1. **User Federation** → **Add provider** → **ldap** (OpenLDAP / generic LDAP).
2. Configure the connection:
    - **Service account user DN**: a service account that can read the `ou=people` branch (e.g. `cn=admin,dc=serendipity,dc=org` with password `admin`, or a dedicated read-only service account).
    - **Edit mode**: `WRITABLE` if you want Keycloak to write changes back to LDAP (e.g. for development); `READ_ONLY` if LDAP is the source of truth and Keycloak should not write back.
    - **Connection URL**: `ldap://localhost:389` (or the container's host/port in your Docker Compose setup).
    - **Users DN**: `ou=people,dc=serendipity,dc=org` — the branch where the sample users live.
    - **Search scope**: `SUBTREE` (to find users in the branch).
    - **User object classes**: `inetOrgPerson`, `organizationalPerson`, `person`, `top` (matching the LDIF).
    - **Username LDAP attribute**: `uid` (or `cn`, depending on your login-name choice — the sample uses `uid` as the login name).
    - **UUID LDAP attribute**: `uid` (or a dedicated attribute; in the sample the stable identifier is the DN, but Keycloak needs a UUID attribute for the `sub` — see note below).
3. **Attribute mapping** — map the LDAP attributes into Keycloak's user model. For the sample:
    - `mail` → `email`
    - `givenName` → `firstName`
    - `sn` → `lastName`
    - `cn` → `displayName` (or use `uid` + `cn` to form the display name)
    - `title` → `title` (custom attribute, if defined)
    - `department` → `department` (custom attribute, if defined)
    - `c` → `c` (custom attribute, if defined — geographic, reporting only)
    - `l` → `l` (custom attribute, if defined — geographic, reporting only)
    - `st` → `st` (custom attribute, if defined — geographic, reporting only)
    - `directoryObjectId` → `directoryObjectId` (custom attribute, source correlation)
    - `manager` → `manager` (**see Import-time resolution below — the value that lands in Keycloak's `manager` must be the manager's Keycloak `sub`, not the LDAP DN**)
4. **Custom attributes must be defined first.** Before the federation will map `title`, `department`, `c`, `l`, `st`, `directoryObjectId`, and `manager` into Keycloak's user profile, those custom attributes must be defined in the realm's **User Profile** schema (see [Keycloak user profile schema and federation alignment](#keycloak-user-profile-schema-and-federation-alignment)). Define them as optional, unmanaged-by-federation-by-default attributes first, then configure the federation mapper to map the upstream values into them.
5. **Test / Synchronize.** Use **Test all users** or **Sync changes** to import the sample users. Verify that each user appears in the Serendipity realm's Users list with the expected attributes.

### Import-time resolution — LDAP DN → Keycloak `sub`

The crux of the LDAP federation case is the same as the Entra ID case: the LDAP `manager` attribute holds a DN (`uid=jane.chen,ou=people,dc=serendipity,dc=org`), but Keycloak's `manager` attribute must hold the manager's **Keycloak `sub`**. The resolution happens at import time (Option A from the enterprise-deployment discussion).

**How the sample does it:**

1. The LDIF pre-computes each user's Keycloak `sub` as a per-user attribute (e.g. `janeChenSerendipitySub: 8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d`).
2. The LDIF also sets each user's `directoryObjectId` to their own LDAP DN.
3. At import time, the federation mapper (or a post-import script) resolves each direct report's LDAP `manager` DN to the Keycloak `sub` of the user whose `directoryObjectId` matches that DN:
    - Read the direct report's LDAP `manager` attribute (e.g. `uid=jane.chen,ou=people,dc=serendipity,dc=org`).
    - Look up the user in the already-imported set whose `directoryObjectId` equals that DN (here, Jane Chen's entry).
    - Read that user's per-user `<name>SerendipitySub` attribute (here, `janeChenSerendipitySub`).
    - Write that UUID into the direct report's Keycloak `manager` attribute.
4. For users with no manager (System Administrator, top-of-hierarchy managers), leave the Keycloak `manager` attribute unset.

**Why pre-computed `sub`s?** In the sample, the `sub` values are pre-computed so the resolution is deterministic and the sample is repeatable. In a real deployment, Keycloak generates the `sub` at import time (it's the `id` of the imported user). The import process would then resolve the manager DN → the manager's Keycloak `sub` using the already-imported manager user's `id` (Keycloak's own `sub`), not a pre-computed attribute. The pre-computed `<name>SerendipitySub` in the sample is a stand-in for that post-import lookup — it makes the sample self-contained and verifiable without running the full import-and-lookup sequence.

**What lands in Keycloak's `manager` attribute for the sample:**

- Direct reports of Jane Chen → `8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d` (Jane Chen's Keycloak `sub`).
- Direct reports of Rafael Okonkwo → `c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f` (Rafael Okonkwo's Keycloak `sub`).
- Jane Chen and Rafael Okonkwo → `4f5a1c2e-3b6d-4a7e-9c01-2d3f4a5b6c7d` (Carl Smith's Keycloak `sub`).
- System Administrator, Carl Smith → *(unset — no manager)*.

**This is the same model as manual and Entra ID provisioning.** The `manager` attribute in Keycloak always holds the manager's Keycloak `sub`. What changes is where the `sub` comes from: manually copied from the Admin Console; resolved from the Entra ID Object ID at Entra ID federation time; or resolved from the LDAP DN at OpenLDAP federation time.

### Roles and groups in the sample

The sample LDIF defines the **people** — their attributes, reporting line, and geographic attributes. The **roles** (`system-administrator`, `sales-manager`, `salesperson`, `basic-user`) and **groups** (`serendipity-team-sydney`, `serendipity-team-melbourne`, etc.) are assigned in Keycloak, either:

- Via the federation mapper (if configured to map LDAP group membership or a custom LDAP attribute into Keycloak roles/groups), or
- Manually in the Admin Console for the sample (after import, assign the appropriate realm role and group to each user).

For the sample, the mapping from user to role is:

| uid | Role | Group(s) |
|---|---|---|
| `system` | `system-administrator` | *(none / or a system group)* |
| `carl.smith` | `sales-manager` | *(or a sales leadership group)* |
| `jane.chen` | `sales-manager` | `serendipity-team-sydney` |
| `rafael.okonkwo` | `sales-manager` | `serendipity-team-melbourne` |
| Direct reports of Jane Chen | `salesperson` | `serendipity-team-sydney` |
| Direct reports of Rafael Okonkwo | `salesperson` | `serendipity-team-melbourne` |

Assign these in Keycloak after import (or configure the federation to do it automatically if the LDAP directory carries group/role information).

### Geographic reporting with the sample

Because every user carries `c`, `l`, `st` in the LDIF (and thus in Keycloak after federation), you can run geographic reports:

- **By state**: "show me all users in NSW" → Jane Chen, Marcus Nguyen, Priya Patel, Tanya Rao.
- **By city**: "show me all users in Melbourne" → Rafael Okonkwo, Liam O'Malley, David Kim, Aisha Bello, Zoe Watson.
- **By country**: "show me all users in AU" → all 16 users (the sample is Australia-only).

These are reporting and filtering queries against the user profile attributes. They do **not** affect the access-control model — a user in NSW can access records owned by a user in Melbourne if the manager hierarchy and roles permit it (or vice versa). Geographic scope as an access-control dimension is not in the model at this point; if it becomes a requirement, it can be added then (as a scope-based rule, per the [Access Control design document](../architecture-guide/access-control/design-document.md)).

### Reloading and extending the sample

- To reload the sample after editing the LDIF, clear the `ou=people` (and `ou=groups`) branch in OpenLDAP and re-run `ldapmodify`, or use a fresh container.
- To add your own users or organisations, add entries to `sample-users.ldif` (or a new LDIF file) following the same conventions: `uid`, `cn`, `givenName`, `sn`, `title`, `department`, `mail`, `manager` (the manager's LDAP DN), `directoryObjectId` (the user's own DN), the per-user `<name>SerendipitySub` (for import-time resolution), and the geographic attributes `c`, `l`, `st`.
- To remove the sample, delete the users from OpenLDAP and from Keycloak (or de-activate them), and re-export the realm if you want the sample to stop persisting.

### What this section does not cover

- Production LDAP/Active Directory/Entra ID federation performance tuning, connection pooling, or failover — refer to the Keycloak Server Administration Guide for LDAP connection configuration.
- Writing changes back to LDAP (`WRITABLE` mode) — the sample uses `READ_ONLY` perspective (the directory is the source of truth); Keycloak writes to its own database. If you enable `WRITABLE` mode, be aware that Keycloak may write user attribute changes back to LDAP.
- The `uuid` / `sub` generation at scale — the sample pre-computes `sub`s for repeatability; a production LDAP federation lets Keycloak generate them at import. The resolution logic (DN → manager's `sub`) is the same either way.
- Password management in LDAP — the sample LDIF includes placeholder `userPassword` values (`{SSHA}...encrypted...`); replace with real hashed passwords if you need users to sign in via the LDAP directory (or rely on Keycloak's own credentials if the federation is read-only and Keycloak is the identity provider).

## What this document does not cover

- Password policy, MFA, and authentication flows — configure in the realm's **Authentication** and **Login** settings (Keycloak administration guide).
- Client, role, and scope configuration for the BFF — Keycloak administration guide.
- The enforcement model and how the tokens are used by the Party Service — [Access Control design document](../architecture-guide/access-control/design-document.md).

## References

- Keycloak Server Administration Guide — [Managing users](https://www.keycloak.org/server/manage-users), [User profile](https://www.keycloak.org/docs/latest/server_admin/index.html#user-profile), [Managing attributes](https://www.keycloak.org/docs/latest/server_admin/index.html#managing-attributes), [Roles](https://www.keycloak.org/server/rbac), [Groups](https://www.keycloak.org/server/manage-groups), [LDAP user federation](https://www.keycloak.org/docs/latest/server_admin/index.html#_ldap_user_federation).
- [Access Control design document](../architecture-guide/access-control/design-document.md) — the model that drives the attribute, role, and group requirements.
- [Keycloak administration guide](./keycloak.md) — realm and client configuration reference.
- Sample users LDIF: `backend/services/openldap/sample-data/au/shane-longman.ldif`.
- [Sample data](./try-install-upgrade/sample-data.md) — getting the sample users into Keycloak and exploring them in the application.
