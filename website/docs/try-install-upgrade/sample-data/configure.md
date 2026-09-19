# Configure

## What the sample data includes

The sample data gives you a small working organisation you can explore immediately after installing Serendipity:

- **A sample political lobbying organisation — Shane Longman** — a fictional international bank (from the 1989 British TV
  series *Capital City*, ITV/Euston Films), with the cast's character names as users. The bank's customers include the
  Australian political parties seeded in the Party Service's `sample-data` (Liberal Party of Australia, Australian Labor
  Party, Australian Greens, etc.). Geographic attributes are the Australian capital cities plus London.
- **Geographic attributes** — every user carries `c` (country), `l` (locality / city) and `st` (state / province), so you
  can see how geographic reporting works. At this point these attributes are for reporting and filtering only — they do
  **not** gate access to records (the access-control model uses `manager` (Keycloak `sub`), roles, and
  `ownedBy`/`assignedTo`). If geographic access-control scope becomes a requirement later, it can be added then.
- **Roles** — each user is assigned a Keycloak realm role that reflects their seniority tier in a consulting / advisory firm,
  not a sales organisation. The Shane Longman roles are distinct from the Sales organisation roles and are designed for a
  services-firm engagement model (see **Roles** below).
- **Groups (teams)** — team groups such as the Shane Longman dealing-room groups, so you can see how team-based authorization
  works.

## The sample organisation — Shane Longman

### About the organisation

**Shane Longman** is a fictional international bank based in the City of London, the setting of the 1989 British TV series
*Capital City* (ITV / Euston Films, 26 September 1989 – 20 December 1990). In the series, the bank's dealing room is home
to a group of investment bankers — traders, a Director of Banking Activities, a Director of Corporate Finance, a Head of
Swaps, a Chief Trader, a Head of Derivatives, a capital markets originator, and IT — whose professional and personal lives
are the focus of the show.

In the Serendipity sample, Shane Longman is a **political lobbying organisation** — a fictional entity whose customers are
the Australian political parties seeded in the Party Service's `sample-data` (`backend/modules/party-service/src/main/resources/sample-data/`).
This lets you see how a lobbying / advisory organisation connects to politically organised customers, and how the existing
Party Service seed data can be leveraged by a sample organisation without duplicating it.

The sample users are the **character names** from *Capital City* (not the actors' real names). Each character is mapped to a
role tier in the Serendipity access-control model.

### Roles

The Shane Longman sample uses a **consulting / advisory-firm role hierarchy**, not a sales organisation. The roles are
coarse-grained Keystone-style tiers that describe the user's seniority and what they are in the firm, not what they can do to
a specific entity (that is governed by the `manager`-as-`sub` hierarchy, `ownedBy`/`assignedTo`, and team groups). The tiers
are:

| Tier | Keycloak role name | Common titles (the role covers all of these) | Who this is in the sample |
|---|---|---|---|
| Entry-level practitioner | `analyst` | Analyst, Associate Analyst | Graduate assistants and junior staff who handle data collection, market research, financial modeling, slide deck preparation, and primary task execution. |
| Mid-level professional | `consultant` | Consultant, Senior Consultant | Experienced professionals responsible for managing specific workstreams, conducting client interviews, designing solutions, and drafting deliverables. |
| Day-to-day project leader | `manager` | Manager, Engagement Manager, Project Leader | Experienced leaders who oversee day-to-day project operations, manage delivery timelines, lead consultant teams, and maintain primary client relationships. |
| Senior practice leader | `senior-manager` | Senior Manager, Director, Associate Partner | Senior leaders tasked with driving multi-project delivery, leading sector or functional practice areas, and actively generating new business. |
| Co-owner / senior executive | `partner` | Partner, Principal, Managing Director | Co-owners or senior executives of the firm focused on revenue generation, strategic client account management, firm governance, and practice development. |

**What this is not:** these are not sales roles (`salesperson`, `sales-manager`, etc.). The Shane Longman sample is a
separate organisation with its own role model. The two role models coexist in the same Keycloak realm — individual users are
assignhed to one or the other depending on which organisation they belong to — but the roles are not interchangeable between
organisations. (A `salesperson` in the Sales org is not the same role tier as a `consultant` in Shane Longman, even if both
are "mid-level practitioners" in their respective firms.)

### The sample users (Shane Longman org)

| User (uid) | Character | Title / role in the series | Department (sample) | Manager (Keycloak sub) | City | State | Role tier (Keycloak role) |
|---|---|---|---|---|---|---|---|
| `system` | System Account | — | System | — | Melbourne | VIC | `system-administrator` |
| `james.farrell` | James Farrell | Chief Executive Officer | Executive | — | London | UK | `partner` |
| `lee.wolf` | Lee Wolf | Director of Corporate Finance | Corporate Finance | `james.farrell`'s sub | London | UK | `senior-manager` |
| `leonard.ansen` | Leonard Ansen | Director of Banking Activities | Banking Activities | `james.farrell`'s sub | London | UK | `senior-manager` |
| `max.lubin` | Max Lubin | Head of Swaps | Swaps | `leonard.ansen`'s sub | Sydney | NSW | `manager` |
| `wendy.foley` | Wendy Foley | Chief Trader / Head of Derivatives | Derivatives | `leonard.ansen`'s sub | Sydney | NSW | `manager` |
| `declan.mcconnachie` | Declan McConnachie | Senior Trader (secondary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `sirkka.nieminen` | Sirkka Nieminen | Senior Trader (secondary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `michelle.hauptmann` | Michelle Hauptmann | Senior Trader (primary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `chas.ewell` | Chas Ewell | Junior Trader (primary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `analyst` |
| `hudson.talbot` | Hudson J. Talbot III | Capital Markets Originator | Capital Markets | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `hannah.burgess` | Hannah Burgess | Dealing Room IT / Computer Systems | IT | `leonard.ansen`'s sub | Canberra | ACT | `consultant` |
| `hilary.rollinger` | Hilary Rollinger | Graduate Assistant (primary desk) | Dealing Room | `leonard.ansen`'s sub | Canberra | ACT | `analyst` |

**Mapping notes:**

- **James Farrell (CEO)** — `partner`. The CEO is a co-owner / senior executive of the firm: revenue generation, strategic
  client account management, firm governance, and practice development. No manager — top of hierarchy.
- **Lee Wolf (Director of Corporate Finance) and Leonard Ansen (Director of Banking Activities)** — `senior-manager`. Both
  are Directors, which in a services firm sit at the Senior Manager / Director / Associate Partner tier: they drive
  multi-project delivery, lead a functional practice area (Corporate Finance; Banking Activities), and actively generate new
  business. Both report to the CEO.
- **Max Lubin (Head of Swaps) and Wendy Foley (Chief Trader / Head of Derivatives)** — `manager`. Both are heads of a
  function / desk: they oversee day-to-day operations of their practice area, manage the consultant team on that desk, and
  maintain primary client relationships for swaps and derivatives work. Both report to Leonard Ansen.
- **Declan McConnachie, Sirkka Nieminen, Michelle Hauptmann (Senior Traders), and Hudson Talbot (Capital Markets
  Originator)** — `consultant`. Senior professionals who manage workstreams (a deal, a client relationship on the desk),
  conduct the analysis and modeling, design solutions, and draft deliverables. They report to their desk head (Leonard Ansen
  directly, or via the Head of Swaps / Head of Derivatives for the primary and secondary desk teams).
- **Hannah Burgess (Dealing Room IT)** — `consultant`. The IT / systems professional who designs and maintains the dealing
  room infrastructure and the systems the traders rely on; a mid-level professional managing a workstream (the IT function for
  the dealing room). Reports to Leonard Ansen.
- **Chas Ewell (Junior Trader) and Hilary Rollinger (Graduate Assistant)** — `analyst`. Entry-level staff: Chas is the junior
  trader on the primary desk executing trades under supervision; Hilary is the graduate assistant who supports the primary desk
  with data collection, research, modeling, and deck preparation. Both report to Leonard Ansen.

### A few things to notice in the sample

- **Manager hierarchy depth** — James Farrell (CEO, `partner`) → Lee Wolf / Leonard Ansen (`senior-manager`) → Max Lubin /
  Wendy Foley (`manager`, the desk heads) → the dealing room consultants and analysts. The `manager` attribute on each user
  holds their manager's Keycloak `sub`, so the manager hierarchy works the same way as any other organisation in the model:
  a user with a `sub` equal to the `manager` attribute of another user receives access to that user's records (subject to
  role and scope). The CEO has no `manager` — top of hierarchy.
- **Geographic spread** — users span London (UK), Sydney (NSW), and Canberra (ACT). The `c`/`l`/`st` attributes are set
  accordingly (`c=UK` for London, `c=AU` for Sydney and Canberra). These are reporting attributes only — they don't affect
  who can see whose records.
- **Character-to-role mapping** — the sample maps the *Capital City* characters to the consulting-firm role tiers consistently
  with both the series' portrayal of each character and the access-control model: the CEO and the two Directors are the senior
  executives / practice leaders; the desk heads are the day-to-day project leaders; the senior traders, capital markets
  originator, and IT lead are the mid-level consultants; the junior trader and the graduate assistant are the entry-level
  analysts.
- **Customers** — the sample's customers are the Australian political parties seeded in the Party Service
  (`backend/modules/party-service/src/main/resources/sample-data/`). This leverages the existing seed data rather than
  duplicating it.
- **Role model is distinct from the Sales org** — the Shane Longman roles (`analyst`, `consultant`, `manager`, `senior-manager`,
  `partner`, `system-administrator`) are not the same as the Sales org roles (`salesperson`, `sales-manager`, etc.). The two
  models coexist in the same Keycloak realm; a user belongs to one organisation and is assigned the role appropriate to that
  organisation. This lets you see how two organisations with different role models can coexist in the same realm.

## Where the sample is defined

The sample users (and their attributes, reporting line, and geographic attributes) are defined as an **LDIF** file:

- `backend/services/openldap/sample-data/au/shane-longman.ldif`

LDIF is the standard format for importing users into an LDAP directory server. In the development path, the LDIF is loaded
into an OpenLDAP directory, and then Keycloak's **LDAP User Federation** imports (or on-demand syncs) the users from that
directory into the Serendipity realm. This is the automated, file-driven alternative to creating users one-by-one in the
Keycloak Admin Console.

For the full explanation of the approach, including the OpenLDAP setup, the Keycloak federation configuration, the attribute
mappings, and the explanation of why the `manager` attribute in the LDIF holds the manager's **LDAP DN** (not the Keycloak
`sub`) and how it gets resolved to the `sub` at import time, see:

- [User Provisioning — LDAP-based provisioning with LDIF](./administration-guide/user-provisioning.md#ldap-based-provisioning-with-ldif-development)

The sample data itself (the accounts, contacts, products and other data you explore in the UI) lives in the application's
sample-data bootstrap — the data you see when you sign in as one of the sample users. That bootstrap is separate from the
LDIF; the LDIF defines the **people** (with their roles, groups, `manager` hierarchy and geographic attributes), and the
application's sample bootstrap defines the **business data** (accounts, contacts, products) associated with those people.

## Getting the sample data into Keycloak

### Prerequisites

- Serendipity installed and running (the backend including the identity service / Keycloak, and the PWA).
- OpenLDAP running with the `serendipity` backend and the `shane-longman.ldif` loaded (see the User Provisioning doc's
  OpenLDAP setup section).
- Keycloak's **LDAP User Federation** configured to connect to the OpenLDAP directory and import/sync the `serendipity`
  `ou=people` branch into the Serendipity realm.

### Steps

1. Load the LDIF into OpenLDAP. Using the OpenLDAP container from the User Provisioning doc:

   ```bash
   docker exec -i serendipity-openldap ldapmodify -x \
     -H ldap://localhost:389 \
     -D "cn=admin,dc=serendipity,dc=org" \
     -w admin \
     -a -f backend/services/openldap/sample-data/au/shane-longman.ldif
   ```

   This loads the `ou=people` and `ou=groups` entries and all the sample users (the Shane Longman sample organisation).

2. Verify the directory has the users. You can browse with `ldapsearch`:

   ```bash
   ldapsearch -x -H ldap://localhost:389 \
     -D "cn=admin,dc=serendipity,dc=org" -w admin \
     -b "ou=people,dc=serendipity,dc=org" "(objectClass=inetOrgPerson)" dn cn mail title department manager c l st
   ```

   You should see the sample users with their `manager` (LDAP DN), `c`/`l`/`st` (geographic attributes), `title`, `department`, and DN.

3. In Keycloak's Admin Console, open the Serendipity realm → **User Federation** → select the LDAP federation provider →
   **Synchronize all users** (or **Sync changes** / **Test all users** depending on the version) to import the sample users
   into the realm. The federation mapper maps the LDAP attributes (including `manager`, `c`, `l`, `st`, `title`, `department`)
   into Keycloak's user model.

4. At import time, the `manager` attribute in Keycloak is set to the **manager's Keycloak `sub`** (not the LDAP DN). The
   sample LDIF pre-computes each user's Keycloak `sub` in the per-user `<name>SerendipitySub` attributes, and the import
   customizes the mapping so that each direct report's `manager` attribute receives the manager's `sub`. (See the User
   Provisioning doc for the resolution approach — Option A: resolve at import time via the `serendipitySub` lookup.)

5. Assign the realm roles (`analyst`, `consultant`, `manager`, `senior-manager`, `partner`, `system-administrator`) and group
   memberships (e.g. the Shane Longman dealing-room groups) to the imported users — either via the federation mapper (if
   configured to map group membership or a custom LDAP attribute into Keycloak roles) or manually in the Admin Console for the
   sample.

6. Export the realm (with the imported users, roles, groups and attributes) to the dev import file so the sample persists
   across container restarts:

   ```bash
   # From the Serendipity backend directory, or via the Keycloak Admin Console's Realm settings → Action → Partial export
   ```

## The sample users (summary)

The sample organisation has:

- **1 shared System Administrator** (top of hierarchy, no manager) — `system`
- **1 Partner / Managing Director** — James Farrell (CEO, top of hierarchy, no manager)
- **2 Senior Managers / Directors** — Lee Wolf (Director of Corporate Finance) and Leonard Ansen (Director of Banking
  Activities), both reporting to the CEO
- **2 Managers / Engagement Managers (desk heads)** — Max Lubin (Head of Swaps) and Wendy Foley (Chief Trader / Head of
  Derivatives), both reporting to Leonard Ansen
- **5 Consultants / Senior Consultants** — Declan McConnachie, Sirkka Nieminen, Michelle Hauptmann (Senior Traders), Hudson
  Talbot (Capital Markets Originator), Hannah Burgess (Dealing Room IT), all reporting to Leonard Ansen
- **2 Analysts / Associate Analysts** — Chas Ewell (Junior Trader) and Hilary Rollinger (Graduate Assistant), both reporting
  to Leonard Ansen

| User (uid) | Character | Title (series) | Department | Manager (Keycloak sub) | City | State | Keycloak role |
|---|---|---|---|---|---|---|---|
| `system` | System Account | — | System | — | Melbourne | VIC | `system-administrator` |
| `james.farrell` | James Farrell | CEO | Executive | — | London | UK | `partner` |
| `lee.wolf` | Lee Wolf | Director of Corporate Finance | Corporate Finance | `james.farrell`'s sub | London | UK | `senior-manager` |
| `leonard.ansen` | Leonard Ansen | Director of Banking Activities | Banking Activities | `james.farrell`'s sub | London | UK | `senior-manager` |
| `max.lubin` | Max Lubin | Head of Swaps | Swaps | `leonard.ansen`'s sub | Sydney | NSW | `manager` |
| `wendy.foley` | Wendy Foley | Chief Trader / Head of Derivatives | Derivatives | `leonard.ansen`'s sub | Sydney | NSW | `manager` |
| `declan.mcconnachie` | Declan McConnachie | Senior Trader (secondary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `sirkka.nieminen` | Sirkka Nieminen | Senior Trader (secondary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `michelle.hauptmann` | Michelle Hauptmann | Senior Trader (primary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `chas.ewell` | Chas Ewell | Junior Trader (primary desk) | Dealing Room | `leonard.ansen`'s sub | Sydney | NSW | `analyst` |
| `hudson.talbot` | Hudson J. Talbot III | Capital Markets Originator | Capital Markets | `leonard.ansen`'s sub | Sydney | NSW | `consultant` |
| `hannah.burgess` | Hannah Burgess | Dealing Room IT / Computer Systems | IT | `leonard.ansen`'s sub | Canberra | ACT | `consultant` |
| `hilary.rollinger` | Hilary Rollinger | Graduate Assistant (primary desk) | Dealing Room | `leonard.ansen`'s sub | Canberra | ACT | `analyst` |

## Removing sample data

To remove the sample data:

1. In Keycloak's Admin Console, delete the sample users from the Serendipity realm (or de-activate them).
2. Remove the sample users from the OpenLDAP directory (e.g. `ldapdelete` the `uid` entries).
3. If you exported the realm with the sample users, re-export without them (or edit the import file to remove the sample user
   entries) and re-import.

## Extending the sample

To add your own sample users or organisations:

1. Add entries to `backend/services/openldap/sample-data/au/shane-longman.ldif` (or a new LDIF file) following the same conventions — `uid`,
   `cn`, `mail`, `title`, `department`, `manager` (the manager's LDAP DN), the pre-computed `<name>SerendipitySub`
   attribute for the user and their manager(s), `directoryObjectId` (the user's own LDAP DN), and the geographic attributes
   `c`, `l`, `st`, plus the Keycloak role that reflects the user's seniority tier in the firm.
2. Re-load the LDIF into OpenLDAP and re-synchronize Keycloak's LDAP User Federation.
3. Add the corresponding roles and groups.
4. Export the realm so the sample persists.

For a production deployment, replace the LDIF / OpenLDAP approach with federation to the enterprise directory (e.g. Microsoft
Entra ID) — see the [User Provisioning doc's Enterprise deployment section](./administration-guide/user-provisioning.md#enterprise-deployment--federation-to-ms-entra-id).
The model stays the same (the `manager` attribute still holds the manager's Keycloak `sub`); what changes is where the users
come from and how the `manager` value is populated.

## References

- [User Provisioning](./administration-guide/user-provisioning.md) — the LDIF approach, OpenLDAP setup, Keycloak federation
  configuration, and the `manager`/`directoryObjectId` attribute model.
- [Keycloak administration guide](./keycloak.md) — realm and client configuration, realm export/import.
- [Access Control design document](../architecture-guide/access-control/design-document.md) — the model that drives the
  `manager`-as-`sub` rule, roles, groups, and the geographic-attributes-are-reporting-only stance.
- *Capital City* — TV series (ITV / Euston Films, 1989–1990). The sample organisation's cast names are taken from the
  series' characters. [Wikipedia — Capital City (TV series)](https://en.wikipedia.org/wiki/Capital_City_(TV_series)).
