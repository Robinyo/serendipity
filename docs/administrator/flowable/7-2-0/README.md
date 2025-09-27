<h1 align="center">Working with Flowable - Version 7.2.0</h1>

## ❯ Flowable

### LDAP

Flowable can be configured to use an LDAP directory server like OpenLDAP.

For example:

```
# LDAP Configuration properties
spring.ldap.base=dc=serendipity,dc=org
# spring.ldap.urls=ldap://localhost:389
spring.ldap.urls=ldap://host.docker.internal:389
spring.ldap.username=cn=admin,dc=serendipity,dc=org
spring.ldap.password=secret

flowable.platform.idm.service-type=ldap

# The base is applied on top of the spring.ldap.base
# Group specific LDAP properties
flowable.ldap.group.query.base=ou=group
flowable.ldap.group.query.default-filter=(objectClass=group)
flowable.ldap.group.mappings.distinguished-name=distinguishedName
flowable.ldap.group.mappings.member=member
flowable.ldap.group.mappings.id=cn
flowable.ldap.group.mappings.key=cn
flowable.ldap.group.mappings.name=cn
# flowable.ldap.group.sort.mode=disabled

# User specific LDAP properties
flowable.ldap.user.query.base=ou=users
flowable.ldap.user.query.default-filter=(objectClass=user)
flowable.ldap.user.mappings.distinguished-name=distinguishedName
flowable.ldap.user.mappings.member-of=memberOf
flowable.ldap.user.mappings.id=uid
flowable.ldap.user.mappings.first-name=cn
flowable.ldap.user.mappings.last-name=sn
flowable.ldap.user.mappings.display-name=displayName,name,cn
flowable.ldap.user.mappings.email=mail
# flowable.ldap.user.mappings.info-name.company=firm
# flowable.ldap.user.mappings.info-name.location=site
# flowable.ldap.user.sort.mode=disabled

# User definition from LDAP
# flowable.ldap.user.mappings.user-definition-key=customAttribute
# flowable.ldap.user.mappings.default-user-definition-key=user-default
# flowable.ldap.user.mappings.value-user-definition-key.admin=user-admin
# flowable.ldap.user.mappings.value-user-definition-key.reporter=user-reporter

flowable.ldap.user.mappings.default-user-definition-key=user-default
flowable.ldap.user.mappings.user-definition-key-mapping-type=groups
flowable.ldap.user.mappings.user-definition-group-mappings[0].group-key=Admin
flowable.ldap.user.mappings.user-definition-group-mappings[0].user-definition-key=user-admin
flowable.ldap.user.mappings.user-definition-group-mappings[1].group-key=Reporter
flowable.ldap.user.mappings.user-definition-group-mappings[1].user-definition-key=user-reporting
```

See: [flowable-ldap-config-7-2-0.env]()

### Users and Groups

Flowable can use OpenLDAP to manage users and groups.

**Note**: Groups must also be configured in Keycloak.

```
# Users

# Flowable (UI Applications) User

dn: uid=flowable.admin, ou=users,dc=serendipity,dc=org
changetype: add
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Flowable
sn: Admin
mail: flowable.admin@serendipity.org
uid: flowable
userPassword: Password12

# Flowable Reporter User

dn: uid=flowable.reporter, ou=users,dc=serendipity,dc=org
changetype: add
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Flowable
sn: Reporter
mail: flowable.reporter@serendipity.org
uid: flowable
userPassword: Password12

# Groups

dn: cn=Admin, ou=groups, dc=serendipity,dc=org
changetype: add
objectclass: top
objectclass: groupOfUniqueNames
cn: Admin
ou: Admin
uniqueMember: uid=flowable.admin,ou=users,dc=serendipity,dc=org

# Groups

dn: cn=Reporter, ou=groups, dc=serendipity,dc=org
changetype: add
objectclass: top
objectclass: groupOfUniqueNames
cn: Reporter
ou: Reporter
uniqueMember: uid=flowable.reporter,ou=users,dc=serendipity,dc=org
```

See: [02-flowable.ldif]()

## ❯ References

### Flowable

* Flowable Open Source docs: [REST API](https://www.flowable.com/open-source/docs/bpmn/ch14-REST)
* Flowable Open Source docs: [LDAP integration](https://www.flowable.com/open-source/docs/bpmn/ch16-Ldap)
* Flowable org: [Community Forum](https://forum.flowable.org/)
* Flowable docs: [Admin - LDAP](https://documentation.flowable.com/latest/admin/installs/platform-full/step-by-step-installation#ldap)
* Flowable docs: [Security - LDAP](https://documentation.flowable.com/latest/develop/be/security#ldap)
