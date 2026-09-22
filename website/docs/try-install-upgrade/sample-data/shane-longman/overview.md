# Overview

**Shane Longman** is a fictional lobbying firm, with sample users generated from the character names of the cast of
the British TV series Capital City (ITV/Euston Films).

Shane Longman is organised into specialised practice areas, strategic support teams, and operational departments.

The core lobbying and practice group is Federal Affairs.
The support teams are Public Affairs and Strategic Communications and Intelligence and Analytics.
Operations and Compliance includes the Business Development and Client Management teams.

### Geographic attributes

Every user includes `l` (locality / city) and `st` (state / province) attributes.
At this point these geographic attributes are for reporting and filtering only — they do **not** gate access to
records.

### Roles

Each user is assigned a Keycloak realm role, roles are coarse-grained and reflect the user's seniority and position.
Not what they can do to a specific entity (that is governed by the `manager`-as-`sub` hierarchy, `ownedBy`/`assignedTo`,
and team groups).

The tiers are:

| Tier | Keycloak role name | Common titles (the role covers all of these) | Who this is in the sample |
|---|---|---|---|
| Entry-level practitioner | `analyst` | Analyst, Associate Analyst | Graduate assistants and junior staff who handle data collection, market research, financial modeling, slide deck preparation, and primary task execution. |
| Mid-level professional | `consultant` | Consultant, Senior Consultant | Experienced professionals responsible for managing specific workstreams, conducting client interviews, designing solutions, and drafting deliverables. |
| Day-to-day project leader | `manager` | Manager, Engagement Manager, Project Leader | Experienced leaders who oversee day-to-day project operations, manage delivery timelines, lead consultant teams, and maintain primary client relationships. |
| Senior practice leader | `senior-manager` | Senior Manager, Director, Associate Partner | Senior leaders tasked with driving multi-project delivery, leading sector or functional practice areas, and actively generating new business. |
| Co-owner / senior executive | `partner` | Partner, Principal, Managing Director | Co-owners or senior executives of the firm focused on revenue generation, strategic client account management, firm governance, and practice development. |

**What this is not:** these are not sales roles (`salesperson`, `sales-manager`, etc.). The Shane Longman sample is a
separate organisation with its own role model. The two role models coexist in the same Keycloak realm — individual users are
assigned to one or the other depending on which organisation they belong to — but the roles are not interchangeable between
organisations. (A `salesperson` in the Sales org is not the same role tier as a `consultant` in Shane Longman, even if both
are "mid-level practitioners" in their respective firms.)

### The sample users

The sample users live in `backend/services/openldap/ldif/shane-longman.ldif`. Their attributes in the LDIF use the
`inetOrgPerson` attribute names directly: `title`, `departmentNumber` (the `inetOrgPerson` department attribute — mapped
to Keycloak's `department` custom attribute at federation time), `mail`, `manager` (the manager's LDAP DN), `l`, `st`, and
`description` (which, in the sample, carries the user's pre-computed Keycloak `sub` — see the user provisioning doc's
import-time resolution section). The table below shows the users, their titles and departments as they appear in the LDIF's
`title`/`departmentNumber` attributes, their manager's LDAP DN, the pre-computed KC `sub` that the resolution uses, and their
geographic attributes.

All 13 users are based in Canberra (`l: Canberra`, `st: ACT`) and use the single `shane-longman.org` email domain.

| uid | Character | Title (LDIF `title`) | Department (LDIF `departmentNumber`) | Manager (LDAP DN) | Pre-computed KC sub (in `description`) | City | State | Keycloak role (assigned after import) |
|---|---|---|---|---|---|---|---|---|
| `system` | System Account | System Account | System | *(none — top of hierarchy)* | *(none)* | Canberra | ACT | `system-administrator` |
| `james.farrell` | James Farrell | Chief Executive Officer | Executive | *(none — top of hierarchy)* | *(none)* | Canberra | ACT | `partner` |
| `lee.wolf` | Lee Wolf | Director, Political Advisory | Political Advisory | `uid=james.farrell,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `22222222-2222-2222-2222-222222222222` | Canberra | ACT | `senior-manager` |
| `leonard.ansen` | Leonard Ansen | Director, Corporate Finance | Corporate Finance | `uid=james.farrell,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `33333333-3333-3333-3333-333333333333` | Canberra | ACT | `senior-manager` |
| `max.lubin` | Max Lubin | Head of Swaps | Derivatives | `uid=leonard.ansen,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `44444444-4444-4444-4444-444444444444` | Canberra | ACT | `manager` |
| `wendy.foley` | Wendy Foley | Chief Trader / Head of Derivatives | Derivatives | `uid=leonard.ansen,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `55555555-5555-5555-5555-555555555555` | Canberra | ACT | `manager` |
| `declan.mcconnachie` | Declan McConnachie | Consultant, Political Advisory | Political Advisory | `uid=lee.wolf,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `66666666-6666-6666-6666-666666666666` | Canberra | ACT | `consultant` |
| `sirkka.nieminen` | Sirkka Nieminen | Consultant, Political Advisory | Political Advisory | `uid=lee.wolf,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `77777777-7777-7777-7777-777777777777` | Canberra | ACT | `consultant` |
| `michelle.hauptmann` | Michelle Hauptmann | Consultant, Corporate Finance | Corporate Finance | `uid=leonard.ansen,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `88888888-8888-8888-8888-888888888888` | Canberra | ACT | `consultant` |
| `chas.ewell` | Chas Ewell | Associate Analyst, Political Advisory | Political Advisory | `uid=lee.wolf,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `bbbbbbbb-cccc-dddd-eeee-ffffffffffff` | Canberra | ACT | `analyst` |
| `hudson.talbot` | Hudson Talbot | Consultant, Corporate Finance | Corporate Finance | `uid=leonard.ansen,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `99999999-9999-9999-9999-999999999999` | Canberra | ACT | `consultant` |
| `hannah.burgess` | Hannah Burgess | Dealing Room IT | IT | `uid=leonard.ansen,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee` | Canberra | ACT | `consultant` |
| `hilary.rollinger` | Hilary Rollinger | Associate Analyst, Corporate Finance | Corporate Finance | `uid=lee.wolf,ou=people,dc=shane-longman,dc=org` | *(own sub:)* `cccccccc-dddd-eeee-ffff-000000000000` | Canberra | ACT | `analyst` |

**Mapping notes:**

- **Lee Wolf and Leonard Ansen** — each has their own pre-computed KC `sub` in their `description` attribute
  (`22222222-...` and `33333333-...` respectively). Both report to James Farrell (whose `description` holds `11111111-...`).
  Their Keycloak `manager` attribute (after import-time resolution) is James Farrell's `sub` (`11111111-...`).
- **Max Lubin and Wendy Foley** — desk heads under Leonard Ansen. After import-time resolution their Keycloak `manager`
  attribute is Leonard Ansen's `sub` (`33333333-...`).
- **Declan McConnachie and Sirkka Nieminen** — senior traders on the political advisory desk, under Lee Wolf. After
  import-time resolution their Keycloak `manager` attribute is Lee Wolf's `sub` (`22222222-...`).
- **Michelle Hauptmann, Hudson Talbot, and Hannah Burgess** — under Leonard Ansen. After import-time resolution their
  Keycloak `manager` attribute is Leonard Ansen's `sub` (`33333333-...`).
- **Chas Ewell** — junior trader on the political advisory desk, under Lee Wolf. After import-time resolution his Keycloak
  `manager` attribute is Lee Wolf's `sub` (`22222222-...`).
- **Hilary Rollinger** — graduate assistant, under Lee Wolf. After import-time resolution her Keycloak `manager` attribute
  is Lee Wolf's `sub` (`22222222-...`).

### A few things to notice in the sample

- **Manager hierarchy depth** — James Farrell (CEO, `partner`) → Lee Wolf / Leonard Ansen (`senior-manager`) → Max Lubin /
  Wendy Foley (`manager`, the desk heads) → the dealing room consultants and analysts. The `manager` attribute on each user
  holds their manager's Keycloak `sub`, so the manager hierarchy works the same way as any other organisation in the model:
  a user with a `sub` equal to the `manager` attribute of another user receives access to that user's records (subject to
  role and scope). The CEO has no `manager` — top of hierarchy.
- **Geographic spread** — the entire sample organisation is based in Canberra. Every user has `l: Canberra`, `st: ACT`.
  These are reporting attributes only — they don't affect who can see whose records.
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

- `backend/services/openldap/ldif/shane-longman.ldif`

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

## References

- *Capital City* — TV series (ITV / Euston Films, 1989–1990). The sample organisation's cast names are taken from the
  series' characters. [Wikipedia — Capital City (TV series)](https://en.wikipedia.org/wiki/Capital_City_(TV_series)).
