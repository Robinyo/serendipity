# Access Control

This doc describes the access-control model Serendipity uses for customer-engagement entities — Accounts (Organisations) and Contacts (Individuals, including Leads and Opportunities in the full model) — and grounds every example in the **Shane Longman sample organisation**: the people and groups shipped in `backend/services/openldap/ldif/shane-longman-v3.4.ldif`, and the Keycloak realm (`roles`, `groups`, and the user records as they land in Keycloak) exported as `backend/services/identity-service/sample-data/au/shane-longman-v1.4.json`.

It complements:

- [Access Control — Design Document](../../../architecture-guide/access-control/design-document.md) — the overall model: roles, ownership, assignment, token design, and enforcement architecture.
- [Overview](overview.md) — what the sample data includes, and the LDIF file version.
- [User Provisioning](user-provisioning.md) — how the LDIF data is imported into Keycloak, including the `manager` mapping and the realm roles you create.
- [Org Chart](org-chart.md) — the reporting structure, rendered in Mermaid.

Where the design document defines the *model*, this page shows how that model behaves when every role, team, and person is a real Shane Longman entry.

## What drives access in Serendipity

Serendipity's access-control model rests on four inputs, none of which the sample changes — the sample only populates them:

| Input | Lives in | Carried on | Purpose in the sample |
|---|---|---|---|
| **Realm roles** | Keycloak realm | `realm_access.roles` in the access token | Coarse entitlement level (analyst, consultant, manager, senior-manager, partner …). One per user in this sample. |
| **Teams (groups)** | Keycloak group, synced from the LDAP `groupOfNames` entries | `groups` claim in the access token | Team-scoped operations — the `assignedToTeam` value on an entity is one of these group names. |
| **Manager** | The owning user's manager, as the `sub` of that manager's Keycloak user — the LDIF `manager` attribute holds a DN; Serendipity *will* resolve it to the `sub` (open item, [Roadmap](../../../roadmap.md)) | `manager` claim in the access token, via the `manager-dn` user-attribute mapper | Manager-hierarchy access: when enabled, users automatically see records owned or assigned to their direct reports. |
| **Entity ownership / assignment** | The Party entity's own fields | `ownedBy`, `assignedTo`, `assignedToTeam` on the entity row | Per-entity entitlements independent of role — a consultant owns an account and can act on it; a manager's team is assigned an account and can act on it. |

That is the whole current model. No geographic scope, no policy engine, no fine-grained per-field permissions. The samples' `l` and `st` attributes are reporting-only and do *not* gate access (see [Overview](overview.md)).

## The sample's realm roles

The current approach defines **five realm roles** in the target Keycloak realm, one per seniority tier, distinct from any Sales-organisation role set (see [Overview](overview.md) and [User Provisioning](user-provisioning.md)):

| Realm role | Tier (per User Provisioning) | LDIF `employeeType` | Who holds it in the sample |
|---|---|---|---|
| `partner` | Co-owner / senior executive | `partner` | **James Farrell** (CEO) |
| `senior-manager` | Senior practice leader | `senior-manager` | **Lee Wolf** (Director, Federal Affairs), **Leonard Ansen** (Director, Strategic Communications) |
| `manager` | Day-to-day project leader | `manager` | **Max Lubin** (Head of Business Development), **Wendy Foley** (Head of Client Management) |
| `consultant` | Mid-level professional | `consultant` | **Declan McConnachie**, **Sirkka Nieminen**, **Michelle Hauptmann**, **Hudson Talbot**, **Hannah Burgess** (Head of IT) |
| `analyst` | Entry-level practitioner | `analyst` | **Chas Ewell**, **Hilary Rollinger** |

Those five roles (plus the realm's built-in `default-roles-serendipity-dev`, `uma_authorization`, and `offline_access`) are all **defined** in the shipped realm export `shane-longman-v1.4.json`. In that export **no user carries a tier role yet** — every one of the fifteen accounts has exactly `realmRoles: ["default-roles-serendipity-dev"]`, and no group has role mappings. The binding is the final step of [User Provisioning](user-provisioning.md): after the LDAP group sync has created the tier groups, you assign each tier role to its matching tier group (e.g. `partner` → `partners`). Once that is done, the effective role for each user is the 1:1 mapping from their LDIF `employeeType` shown in the table above.

The **`system` account** (`uid=system`) is one of the 13 LDIF users. Its `employeeType` is `system-administrator`, which is *not* one of the five tier roles above, and it does not belong to any tier group — in the realm export it has no groups at all. How it is treated at runtime — which realm role it should hold (if any), which client roles or scopes it should expose for integration traffic, and which endpoints it should be able to call — is an explicit open item in [User Provisioning](user-provisioning.md) and the [Access Control design document](../../../architecture-guide/access-control/design-document.md).

In every case the tier a user lands in matches their LDIF `employeeType` — in the v3.4 sample the two read the same for every account, so you can treat either as the source of truth for "who sits at which tier." The membership that actually drives the `groups` claim comes from the `member:` lines on each tier group's `groupOfNames` entry, which the `group-ldap-mapper` syncs into Keycloak; once the matching tier role is bound to that tier group (the last provisioning step, described above), the user's tier role follows from their tier-group membership as well.

## Teams (groups), in sample terms

The design document's rule is "the group is the team." Serendipity's teams are Keycloak groups, and the group name is the value stored on the entity as `assignedToTeam`. The sample ships two practice teams — these are the *real* Serendipity teams, the ones that can be assigned to entities:

| Keycloak group (from `ou=groups` in the LDIF) | Members (sample) | Purpose |
|---|---|---|
| `federal-affairs` | Lee Wolf, Declan McConnachie, Sirkka Nieminen, Chas Ewell | **Federal Affairs** practice team. `assignedToTeam: federal-affairs` on any account or contact means the team (and its senior-manager, per the hierarchy, per their realm role) has scope over it. |
| `strategic-communications` | Leonard Ansen, Max Lubin, Wendy Foley, Michelle Hauptmann, Hudson Talbot, Hannah Burgess, Hilary Rollinger | **Strategic Communications** practice team. `assignedToTeam: strategic-communications` works the same way. |

Both are `groupOfNames` entries in the LDIF (`ou=groups`) and are mapped into Keycloak via the `group-ldap-mapper` (see [User Provisioning](user-provisioning.md)). After provisioning, entities carry these group names in `assignedToTeam`, and the Party Service compares the caller's `groups` claim against that field when applying team-scoped rules.

The sample also ships **five tier groups** — `analysts`, `consultants`, `managers`, `senior-managers`, `partners`. These mirror the realm roles and the `employeeType` tiers. In the sample they exist for **display and audit**, not for authorization:

| Tier group | Mirrors the tier | Members |
|---|---|---|
| `analysts` | `analyst` | Chas Ewell, Hilary Rollinger |
| `consultants` | `consultant` | Declan McConnachie, Sirkka Nieminen, Michelle Hauptmann, Hudson Talbot, Hannah Burgess |
| `managers` | `manager` | Max Lubin, Wendy Foley |
| `senior-managers` | `senior-manager` | Lee Wolf, Leonard Ansen |
| `partners` | `partner` | James Farrell |

They map cleanly to the realm roles — which is exactly what you want for a "who is at what level" report or a PWA filter. They are **not** teams, and they should **not** be used as `assignedToTeam` values: `assignedToTeam: consultants` on an account would be a data-entry mistake, because "who acts on this entity" is answered by the practice team, not by the set of people at the same seniority level.

## Manager hierarchy, in sample terms

The design document's *manager hierarchy* rule is the access path that lets a user with a manager-hierarchical realm role (`manager` or `senior-manager`) automatically see records owned or assigned to their direct reports, without a per-entity `assignedToTeam` entry. In the sample, that hierarchy is the LDIF `manager` attribute, which [User Provisioning](user-provisioning.md) maps (via the `manager-dn` mapper) into a Keycloak user attribute. In the shipped realm export that value is **the manager's directory name** — for example Lee Wolf's `manager` is `uid=james.farrell,ou=people,dc=shane-longman,dc=org` — not a bare username or a token of Keycloak's; the enforcement layer resolves that to the manager's identity when it evaluates the hierarchy rule. The chain, as shipped in v3.4:

```
James Farrell (partner)                        -- no manager; the root
├── Lee Wolf (senior-manager)
│   ├── Declan McConnachie (consultant)
│   ├── Sirkka Nieminen (consultant)
│   └── Chas Ewell (analyst)
└── Leonard Ansen (senior-manager)
    ├── Max Lubin (manager)
    ├── Wendy Foley (manager)
    ├── Michelle Hauptmann (consultant)
    ├── Hudson Talbot (consultant)
    ├── Hannah Burgess (consultant)
    └── Hilary Rollinger (analyst)
```

Eleven of the thirteen LDIF users have a manager; **James Farrell** (the CEO, who sits above everyone) and the **`system`** account do not. The 11 are the ones the hierarchy rule can act on.

Applied to the sample, the hierarchy rule is where the *manager* and *senior-manager* roles earn their keep:

- **Lee Wolf** (senior-manager). Holds the `senior-manager` realm role. When the Party Service evaluates a request from him, the hierarchy rule contributes the set of entities owned or assigned to **his direct reports** — Declan McConnachie, Sirkka Nieminen, Chas Ewell. On top of that, if the entity is in his team (`federal-affairs`) or he is the owner, his role is also sufficient.
- **Leonard Ansen** (senior-manager). Same mechanics, direct reports: **Max Lubin, Wendy Foley, Michelle Hauptmann, Hudson Talbot, Hannah Burgess, Hilary Rollinger** — six direct reports on the Strategic Communications team. The depth of the chain he reaches is one; the two managers below him are his direct reports.
- **Max Lubin** (manager). Holds the `manager` realm role. The hierarchy rule would contribute any entity owned or assigned to **his direct reports** — but in the sample, *no user has `manager: uid=max.lubin`*. His effective scope from the hierarchy rule is therefore empty; his access comes entirely from his realm role, his team group, and any `ownedBy` or `assignedTo` entries that point at his `sub`. This is an honest reading of the v3.4 LDIF — see [Open items](#open-items) if the intent is different.
- **Wendy Foley** (manager). Same situation as Max Lubin — `manager: uid=wendy.foley` does not appear on any user entry in the sample.
- **The five consultants** (Declan, Sirkka, Michelle, Hudson, Hannah) and **the two analysts** (Chas, Hilary). The hierarchy rule does not contribute to their scope — they neither have the `manager` nor the `senior-manager` realm role. Their scope is everything owned by them (`ownedBy` = their `sub`) or assigned to them individually (`assignedTo` = their `sub`).

The **`partner`** role (James Farrell) is the only *system-level* role in the sample — full cross-organisation access. The hierarchy rule is not what gives him that scope; the realm role is. His `manager` attribute is empty for the same reason: there is nobody above him in the sample.

## Access matrix, in sample terms

The design document's two matrices (Accounts, Contacts) are role-based. Applied to the sample, they become a person-based matrix, because each of the five realm roles is held by one or more named people. The effective permission for each sample user, under the current approach:

| User | Realm role | Direct teams (Keycloak group) | Inherited scope (hierarchy rule) | Owned / individually assigned |
|---|---|---|---|---|
| **James Farrell** | `partner` | `partners` | — (no manager; top of the chain) | Own records, plus full cross-org from his realm role |
| **Lee Wolf** | `senior-manager` | `senior-managers`, `federal-affairs` | Declan, Sirkka, Chas (his direct reports' records) | Own records |
| **Leonard Ansen** | `senior-manager` | `senior-managers`, `strategic-communications` | Max, Wendy, Michelle, Hudson, Hannah, Hilary (his direct reports' records) | Own records |
| **Max Lubin** | `manager` | `managers`, `strategic-communications` | *None* — no user in the sample has him as manager | Own records + anything assigned to him individually |
| **Wendy Foley** | `manager` | `managers`, `strategic-communications` | *None* — no user in the sample has her as manager | Own records + anything assigned to her individually |
| **Declan McConnachie** | `consultant` | `consultants`, `federal-affairs` | — | Own + individually assigned |
| **Sirkka Nieminen** | `consultant` | `consultants`, `federal-affairs` | — | Own + individually assigned |
| **Chas Ewell** | `analyst` | `analysts`, `federal-affairs` | — | Own + individually assigned |
| **Michelle Hauptmann** | `consultant` | `consultants`, `strategic-communications` | — | Own + individually assigned |
| **Hudson Talbot** | `consultant` | `consultants`, `strategic-communications` | — | Own + individually assigned |
| **Hannah Burgess** | `consultant` | `consultants`, `strategic-communications` | — | Own + individually assigned |
| **Hilary Rollinger** | `analyst` | `analysts`, `strategic-communications` | — | Own + individually assigned |
| **system** | (no realm role assigned in the sample) | (no tier group in the sample) | n/a (no manager) | Machine access; see [Open items](#open-items) |

## What a token for a sample user actually carries

The design document's token design applies to the sample unchanged. For concreteness, an access token for **Lee Wolf** would carry:

| Claim | Value (example) | Source |
|---|---|---|
| `sub` | Keycloak user UUID (not the `uid`) | Keycloak |
| `preferred_username` | `lee.wolf` | The user's `username` attribute (the `uid` in the LDIF), surfaced via the `profile` client scope |
| `realm_access.roles` | `["senior-manager", "default-roles-serendipity-dev", "uma_authorization", "offline_access"]` | The tier role bound to his `senior-managers` group at provisioning (below) |
| `groups` | `["senior-managers", "federal-affairs"]` | Group Membership mapper |
| `manager` | The `sub` (UUID) of **James Farrell** | The `manager-dn` user-attribute mapper copies the DN off LDAP; the access layer *will* resolve it to the manager's `sub` before it lands on the token (open item — see [Roadmap](../../../roadmap.md)) — the access-control model depends on this |
| `jobTitle` | `Director, Federal Affairs` | The `job-title` user-attribute mapper (`title` → `jobTitle`) |
| `department` | `Federal Affairs` | The `department` user-attribute mapper (`departmentNumber` → `department`) |
| `employeeType` | `senior-manager` | The `employee-type` user-attribute mapper (`employeeType` → `employeeType`) |

The Party Service (and any other service that enforces access) reads the role, the team, the manager chain, and the entity's `ownedBy` / `assignedTo` / `assignedToTeam` fields to decide whether Lee Wolf is entitled to the operation. It does **not** call Keycloak on every request — the token carries enough to make the decision locally, with a cache lookup for the `manager` chain when the manager-hierarchy rule is enabled.

The same shape applies to every other sample user. **James Farrell's** `manager` attribute is empty (he sits at the top of the chain — nobody reports to him). **Max Lubin's** and **Wendy Foley's** `manager` attribute is **Leonard Ansen's** DN (`uid=leonard.ansen,ou=people,dc=shane-longman,dc=org`). **The `system` account's** `manager` attribute is empty, and it carries no realm role in the sample.

## Open items

These are the sample-specific and model-level open items the current approach leaves deliberately open; the sample exercises them without changing them:

- **The `system` account's role.** The LDIF gives it `employeeType: system-administrator`, which is *not* one of the five realm roles the current approach ships. How the `system` account is treated at runtime — which realm role (if any) it should hold, which client roles or scopes it should expose for integration traffic — is an open decision (see [User Provisioning](user-provisioning.md) and the [Access Control design document](../../../architecture-guide/access-control/design-document.md)).
- **Resolving the `manager` DN to a `sub`.** The LDIF stores the `manager` attribute as a DN (e.g. `uid=james.farrell,ou=people,dc=shane-longman,dc=org`) and the realm export carries the same DN. The Party Service needs that DN resolved to the manager's Keycloak `sub` (UUID) before it can evaluate the hierarchy rule — the same `sub` it compares `ownedBy` and `assignedTo` against. This resolution is **not yet implemented**; until it is, the manager-hierarchy rule is in the *design* but not yet *enforceable*. Tracked on the [Roadmap](../../../roadmap.md).
- **Analyst vs. consultant depth.** The sample ships both `employeeType: analyst` and `employeeType: consultant` as separate realm roles, but the current design does not draw a *role-depth* boundary between them — both are working-tier roles in the sense that neither has the hierarchy rule. If you need one (e.g. analysts read-only, consultants write), that is a deployment decision that belongs in a custom realm role or a profile attribute, not in the base set of five. The sample's LDIF supports either reading.
- **The two managers' inheritance is empty.** Max Lubin and Wendy Foley are not any user's manager in the sample. If the intent is that the two `manager` users *do* oversee some analysts/consultants, the fix is to add the corresponding `manager:` lines to user entries in a new LDIF version, not to change the design rule. The hierarchy rule itself is depth-agnostic — it activates when a user is somebody's manager, and the sample's data determines whether that is true.
- **Basic User.** The current approach does not ship a `basic-user` realm role; that role belongs to the Sales-organisation design model, not to the sample's five-tier model. If you add one for the sample, it is a 1:1 mapping to a new `employeeType` value on the LDIF.
- **Entity-level scoping.** The sample's LDIF carries people and groups, not entities. The `ownedBy`, `assignedTo`, and `assignedToTeam` fields are on *Party* entities (Accounts, Contacts); the sample's Party Service `sample-data` seeds those with Liberal Party of Australia, Australian Labor Party, Australian Greens, and the other Australian parties. The access model applies the same way to those seeded entities: who owns them, who is assigned to them, and which `assignedToTeam` value they carry — the team group name is one of the sample's Keycloak groups.
