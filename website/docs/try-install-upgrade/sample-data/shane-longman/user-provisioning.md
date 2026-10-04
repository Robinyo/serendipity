# User Provisioning

## Getting the sample data into Keycloak

### Steps

1. Create the user profile custom attributes in Keycloak:

| Attribute      | Value                                  | Notes                                                                                     |
|----------------|----------------------------------------|-------------------------------------------------------------------------------------------|
| `jobTitle`     | A string                               | Optional profile attribute.                                                               |
| `department`   | A string                               | Optional profile attribute.                                                               |
| `employeeType` | A string                               | Optional profile attribute.                                                               |
| `manager`      | The `sub` (UUID) of the user's manager | The one attribute the access-control model depends on — it enables the manager hierarchy. |

2. Create the realm roles in Keycloak:

| Tier                        | Keycloak role name | Common titles (the role covers all of these) | Who this is in the sample                                                                                                                                   |
|-----------------------------|--------------------|----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Entry-level practitioner    | `analyst`          | Analyst, Associate Analyst                   | Graduate assistants and junior staff who handle data collection, market research, financial modeling, slide deck preparation, and primary task execution.   |
| Mid-level professional      | `consultant`       | Consultant, Senior Consultant                | Experienced professionals responsible for managing specific workstreams, conducting client interviews, designing solutions, and drafting deliverables.      |
| Day-to-day project leader   | `manager`          | Manager, Engagement Manager, Project Leader  | Experienced leaders who oversee day-to-day project operations, manage delivery timelines, lead consultant teams, and maintain primary client relationships. |
| Senior practice leader      | `senior-manager`   | Senior Manager, Director, Associate Partner  | Senior leaders tasked with driving multi-project delivery, leading sector or functional practice areas, and actively generating new business.               |
| Co-owner / senior executive | `partner`          | Partner, Principal, Managing Director        | Co-owners or senior executives of the firm focused on revenue generation, strategic client account management, firm governance, and practice development.   |

3. In Keycloak's Admin Console, [add an LDAP provider](../../../administration-guide/keycloak#using-external-storage).

   Configure the Custom User Attribute Mappers:

| Mapper Name   | Mapper Type                | Keycloak Attribute | LDAP Attribute     |
|---------------|----------------------------|--------------------|--------------------|
| job-title     | user-attribute-ldap-mapper | `jobTitle`         | `title`            |
| department    | user-attribute-ldap-mapper | `department`       | `departmentNumber` |
| employee-type | user-attribute-ldap-mapper | `employeeType`     | `employeeType`     |
| locality-city | user-attribute-ldap-mapper |                    | `l`                |
| state-region  | user-attribute-ldap-mapper |                    | `st`               |
| manager-dn    | user-attribute-ldap-mapper | `manager`          | `manager`          |

   The federation mapper maps the LDAP attributes into Keycloak's user profile. 
   When you configure the `group-ldap-mapper` and trigger a synchronisation (or when a user logs in), Keycloak automatically reads the LDAP directory branch and creates the corresponding groups in Keycloak dynamically.
   You assign realm roles to the groups after the LDAP group sync has run at least once (or after you manually trigger the initial sync) so that the synced groups exist in Keycloak.

:::info
Every user includes `l` (locality / city) and `st` (state / province) attributes.
At this point these geographic attributes are for reporting and filtering only — they do **not** gate access to
records.
:::

## References

* Keycloak: [Add an LDAP provider](../../../administration-guide/keycloak#using-external-storage)
