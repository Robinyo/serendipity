# User Provisioning

## Getting the sample data into Keycloak

### Prerequisites

- Serendipity installed and running (the backend including the identity service / Keycloak, and the PWA).
- OpenLDAP running with the `serendipity` backend and the `shane-longman.ldif` loaded (see the User Provisioning doc's
  OpenLDAP setup section).
- Keycloak's **LDAP User Federation** configured to connect to the OpenLDAP directory and import/sync the `shane-longman`
  `ou=people` branch into the Serendipity realm.

### Steps

1. Load the LDIF into OpenLDAP. Using the OpenLDAP container from the User Provisioning doc:

   ```bash
   docker exec -i serendipity-openldap ldapmodify -x \
     -H ldap://localhost:389 \
     -D "cn=admin,dc=shane-longman,dc=org" \
     -w admin \
     -a -f backend/services/openldap/ldif/shane-longman.ldif
   ```

   This loads the `ou=people` and `ou=groups` entries and all the sample users (the Shane Longman sample organisation).

2. Verify the directory has the users. You can browse with `ldapsearch`:

   ```bash
   ldapsearch -x -H ldap://localhost:389 \
     -D "cn=admin,dc=shane-longman,dc=org" -w admin \
     -b "ou=people,dc=shane-longman,dc=org" "(objectClass=inetOrgPerson)" dn cn mail title departmentNumber manager l st description
   ```

   You should see the sample users with their `manager` (LDAP DN), `l`/`st` (geographic attributes — all `l: Canberra`,
   `st: ACT`), `title`, `departmentNumber`, `description` (the pre-computed KC sub), and DN.

3. In Keycloak's Admin Console, open the Serendipity realm → **User Federation** → select the LDAP federation provider →
   **Synchronize all users** (or **Sync changes** / **Test all users** depending on the version) to import the sample users
   into the realm. The federation mapper maps the LDAP attributes (including `manager`, `l`, `st`, `title`, `departmentNumber`)
   into Keycloak's user model.

4. At import time, the `manager` attribute in Keycloak is set to the **manager's Keycloak `sub`** (not the LDAP DN). The
   sample LDIF pre-computes each user's Keycloak `sub` in the per-user `description` attribute, and the import customizes the
   mapping so that each direct report's `manager` attribute receives the manager's `sub`. (See the User Provisioning doc for
   the resolution approach — Option A: resolve at import time via the `description`-as-sub lookup: read the direct report's
   `manager` DN, look up the user whose LDAP DN matches that DN, read that user's `description` value, and write that UUID
   into the direct report's Keycloak `manager` attribute.)

5. Assign the realm roles (`analyst`, `consultant`, `manager`, `senior-manager`, `partner`, `system-administrator`) and group
   memberships (e.g. the Shane Longman dealing-room groups) to the imported users — either via the federation mapper (if
   configured to map group membership or a custom LDAP attribute into Keycloak roles) or manually in the Admin Console for the
   sample.

6. Export the realm (with the imported users, roles, groups and attributes) to the dev import file so the sample persists
   across container restarts:

   ```bash
   # From the Serendipity backend directory, or via the Keycloak Admin Console's Realm settings → Action → Partial export
   ```

## Removing sample data

To remove the sample data:

1. In Keycloak's Admin Console, delete the sample users from the Serendipity realm (or de-activate them).
2. Remove the sample users from the OpenLDAP directory (e.g. `ldapdelete` the `uid` entries).
3. If you exported the realm with the sample users, re-export without them (or edit the import file to remove the sample user
   entries) and re-import.

## Extending the sample

To add your own sample users or organisations:

1. Add entries to `backend/services/openldap/ldif/shane-longman.ldif` (or a new LDIF file) following the same conventions — `uid`,
   `cn`, `givenName`, `sn`, `mail`, `title`, `departmentNumber` (the `inetOrgPerson` department attribute — mapped to Keycloak's
   `department` custom attribute at federation time), `manager` (the manager's LDAP DN), the `description` attribute carrying the
   user's pre-computed KC `sub` (for import-time resolution — the same `description`-as-sub lookup: read the direct report's
   `manager` DN, look up the manager's entry by DN, read the `description` value, and write that UUID into the direct report's
   `manager` attribute), and the geographic attributes `l`, `st` (with `c` **not** used on user entries — see the geographic
   attributes note above), plus the Keycloak role that reflects the user's seniority tier in the firm.
2. Re-load the LDIF into OpenLDAP and re-synchronize Keycloak's LDAP User Federation.
3. Add the corresponding roles and groups.
4. Export the realm so the sample persists.

For a production deployment, replace the LDIF / OpenLDAP approach with federation to the enterprise directory (e.g. Microsoft
Entra ID) — see the [User Provisioning doc's Enterprise deployment section](./administration-guide/user-provisioning.md#enterprise-deployment--federation-to-ms-entra-id).
The model stays the same (the `manager` attribute still holds the manager's Keycloak `sub`); what changes is where the users
come from and how the `manager` value is populated.

## References

- [User Provisioning](./administration-guide/user-provisioning.md) — the LDIF approach, OpenLDAP setup, Keycloak federation
  configuration, and the `manager`-as-`sub` attribute model.
- [Keycloak administration guide](./keycloak.md) — realm and client configuration, realm export/import.
- [Access Control design document](../architecture-guide/access-control/design-document.md) — the model that drives the
  `manager`-as-`sub` rule, roles, groups, and the geographic-attributes-are-reporting-only stance.
- *Capital City* — TV series (ITV / Euston Films, 1989–1990). The sample organisation's cast names are taken from the
  series' characters. [Wikipedia — Capital City (TV series)](https://en.wikipedia.org/wiki/Capital_City_(TV_series)).
