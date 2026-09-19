# Configure

## What the sample data includes

The sample data gives you a small working organisation you can explore immediately after installing Serendipity:

- **People (users)** — a small sales and usage/accounts team, with a reporting line (manager hierarchy), geographic
  attributes (state / city / country), roles, and Keycloak `sub` values pre-computed for import.
- **A manager hierarchy** — a System Administrator at the top, two managers (Sydney Sales Manager, Melbourne Account/Usage
  Manager), and their direct reports spread across Sydney, Melbourne, Brisbane, Adelaide and Perth.
- **Geographic attributes** — every user carries `c` (country), `l` (locality / city) and `st` (state / province), so you
  can see how geographic reporting works. At this point these attributes are for reporting and filtering only — they do
  **not** gate access to records (the access-control model uses `manager` (Keycloak `sub`), roles, and
  `ownedBy`/`assignedTo`). If geographic access-control scope becomes a requirement later, it can be added then.
- **Roles** — each user is assigned a Keycloak realm role (`system-administrator`, `sales-manager`, `salesperson` or
  `basic-user`) consistent with the access-control model.
- **Groups (teams)** — team groups such as `serendipity-team-sydney` and `serendipity-team-melbourne`, so you can see how
  team-based authorization works.

## Where the sample is defined

The sample users (and their attributes, reporting line, and geographic attributes) are defined as an **LDIF** file:

- `backend/services/openldap/sample-orgs/sample-users.ldif`

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
- OpenLDAP running with the `serendipity` backend and the `sample-users.ldif` loaded (see the User Provisioning doc's
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
     -a -f backend/services/openldap/sample-orgs/sample-users.ldif
   ```

   This loads the `ou=people` and `ou=groups` entries and all the sample users.

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
   sample LDIF pre-computes each user's Keycloak `sub` in the `carlSmithSerendipitySub`, `janeChenSerendipitySub`,
   `rafaelOkonkwoSerendipitySub` and per-user `<name>SerendipitySub` attributes, and the import customizes the mapping so
   that each direct report's `manager` attribute receives the manager's `sub`. (See the User Provisioning doc for the
   resolution approach — Option A: resolve at import time via the `serendipitySub` lookup.)

5. Assign the realm roles (`sales-manager`, `salesperson`, `basic-user`, `system-administrator`) and group memberships
   (`serendipity-team-sydney`, `serendipity-team-melbourne`, etc.) to the imported users — either via the federation mapper
   (if configured to map group membership from the directory) or manually in the Admin Console for the sample.

6. Export the realm (with the imported users, roles, groups and attributes) to the dev import file so the sample persists
   across container restarts:

   ```bash
   # From the Serendipity backend directory, or via the Keycloak Admin Console's Realm settings → Action → Partial export
   ```

## The sample users

The sample organisation has:

- **1 System Administrator** (top of hierarchy, no manager) — `system`
- **2 managers** — Jane Chen (Sales Manager, Sydney) and Rafael Okonkwo (Account / Usage Manager, Melbourne). Both report
  to Carl Smith in the LDIF's `manager` chain; in the Keycloak model Carl is the top manager and Jane/Rafael report to him
  (their `manager` attribute = Carl's `sub`).
- **10 direct reports** across Sydney, Melbourne, Brisbane, Adelaide and Perth — salespeople and a usage analyst.

| User (uid) | Name | Title | Department | Manager (Keycloak sub) | City | State | Role |
|---|---|---|---|---|---|---|---|
| `system` | System Account | System Account | System | — | Melbourne | VIC | `system-administrator` |
| `carl.smith` | Carl Smith | (top manager) | (top) | — | Melbourne | VIC | `sales-manager` |
| `jane.chen` | Jane Chen | Sales Manager — Sydney | Sales | `carl.smith`'s sub | Sydney | NSW | `sales-manager` |
| `rafael.okonkwo` | Rafael Okonkwo | Account / Usage Manager — Melbourne | Usage / Accounts | `carl.smith`'s sub | Melbourne | VIC | `sales-manager` |
| `marcus.nguyen` | Marcus Nguyen | Salesperson — Sydney | Sales | `jane.chen`'s sub | Sydney | NSW | `salesperson` |
| `priya.patel` | Priya Patel | Salesperson — Sydney | Sales | `jane.chen`'s sub | Sydney | NSW | `salesperson` |
| `liam.omalley` | Liam O'Malley | Salesperson — Melbourne | Sales | `jane.chen`'s sub | Melbourne | VIC | `salesperson` |
| `aisha.bello` | Aisha Bello | Usage Analyst — Melbourne | Usage / Accounts | `rafael.okonkwo`'s sub | Melbourne | VIC | `salesperson` |
| `david.kim` | David Kim | Salesperson — Melbourne | Sales | `jane.chen`'s sub | Melbourne | VIC | `salesperson` |
| `lee.smith` | Lee Smith | Salesperson — Brisbane | Sales | `jane.chen`'s sub | Brisbane | QLD | `salesperson` |
| `tanya.rao` | Tanya Rao | Sales Executive — Sydney | Sales | `jane.chen`'s sub | Sydney | NSW | `salesperson` |
| `zoe.watson` | Zoe Watson | Sales Executive — Melbourne | Sales | `jane.chen`'s sub | Melbourne | VIC | `salesperson` |
| `nick.park` | Nick Park | Sales Executive — Brisbane | Sales | `jane.chen`'s sub | Brisbane | QLD | `salesperson` |
| `sam.wilson` | Sam Wilson | Sales Executive — Adelaide | Sales | `jane.chen`'s sub | Adelaide | SA | `salesperson` |
| `ella.martinez` | Ella Martinez | Sales Executive — Perth | Sales | `jane.chen`'s sub | Perth | WA | `salesperson` |

A few things to notice in the sample:

- **Manager hierarchy depth** — Carl Smith → Jane Chen / Rafael Okonkwo → their direct reports. The `manager` attribute on
  each direct report holds the manager's Keycloak `sub`, so a Sales Manager can access their direct reports' records (subject
  to role and scope). The System Administrator has no `manager` — they are top of hierarchy.
- **Geographic spread** — users span NSW, VIC, QLD, SA and WA. The `c`/`l`/`st` attributes let you run geographic reports
  (e.g. "show me all salespeople in NSW"). These are reporting attributes only — they don't affect who can see whose records.
- **One user has an inconsistent state form** — `sunrise.nurse` (if you load the full LDIF) uses `st: Queensland` rather than
  the 2-letter code `QLD`, as a deliberate edge case to test how consumers handle inconsistent state representations. The
  sample in the table above uses the consistent 2-letter form. Decide whether to normalize in the LDIF or handle in the app
  — see the User Provisioning doc's note on state-code normalization.

## Removing sample data

To remove the sample data:

1. In Keycloak's Admin Console, delete the sample users from the Serendipity realm (or de-activate them).
2. Remove the sample users from the OpenLDAP directory (e.g. `ldapdelete` the `uid` entries).
3. If you exported the realm with the sample users, re-export without them (or edit the import file to remove the sample user
   entries) and re-import.

## Extending the sample

To add your own sample users or organisations:

1. Add entries to `frontend/style-guide/sample-users.ldif` (or a new LDIF file) following the same conventions — `uid`,
   `cn`, `mail`, `title`, `department`, `manager` (the manager's LDAP DN), the pre-computed `<name>SerendipitySub`
   attribute for the user and their manager(s), `directoryObjectId` (the user's own LDAP DN), and the geographic attributes
   `c`, `l`, `st`.
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
