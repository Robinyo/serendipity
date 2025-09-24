<h1 align="center">Working with OpenLDAP</h1>

## ❯ Bitnami container image for OpenLDAP

### Docker Compose

Using Docker Compose to launch OpenLDAP is a straightforward process.

For example:

```
services:

  openldap:
    container_name: openldap
    build:
      context: ./services/openldap
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "389:1389"
      - "636:1636"
    environment:
      LDAP_ROOT: 'dc=serendipity,dc=org'
      LDAP_ADMIN_USERNAME: '${LDAP_ADMIN_USERNAME}'
      LDAP_ADMIN_PASSWORD: '${LDAP_ADMIN_PASSWORD}'
      LDAP_ADMIN_DN: 'cn=admin,dc=serendipity,dc=org'
      LDAP_CUSTOM_LDIF_DIR: '/ldifs'
    env_file:
      - '${PWD}/.env'
    volumes:
      - openldap_data:/var/lib/openldap/data
    networks:
      - backend
```

#### Configuration

.env:

```
# OpenLDAP
LDAP_ADMIN_USERNAME=admin
LDAP_ADMIN_PASSWORD=secret
```

### LDIF

To import an LDIF (LDAP Data Interchange Format) file place the file in the following location:

```
├── /serendipity
    └── /backend
        └── /modules
        └── /services
            └── /nginx        
            └── /openldap
                └── /ldifs
                    ├── 01-serendipity-org.ldif  
        ├── docker-compose.yml
        ├── pom.xml
```

When you launch the container it will create the organisation (`serendipity`), create the domain (`serendipity.org`) 
and set the LDAP administrator's username and password.

Let's check and see:

```
docker exec openldap ldapsearch -x -H ldap://localhost:1389 -b "dc=serendipity,dc=org"
```

You should see something like:

```
# extended LDIF
#
# LDAPv3
# base <dc=serendipity,dc=org> with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#

# serendipity.org
dn: dc=serendipity,dc=org
dc: serendipity
objectClass: dcObject
objectClass: organization
o: Serendipity Org

# users, serendipity.org
dn: ou=users,dc=serendipity,dc=org
objectClass: organizationalUnit
objectClass: extensibleObject
objectClass: top
ou: users
description: All users in the organisation

# groups, serendipity.org
dn: ou=groups,dc=serendipity,dc=org
objectClass: organizationalUnit
objectClass: extensibleObject
objectClass: top
ou: groups
description: All groups in the organisation

# rob.ferguson, users, serendipity.org
dn: uid=rob.ferguson,ou=users,dc=serendipity,dc=org
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: Rob
sn: Ferguson
mail: rob.ferguson@serendipity.org
uid: rob.ferguson
userPassword:: UGFzc3dvcmQxMg==

# sean.doyle, users, serendipity.org
dn: uid=sean.doyle,ou=users,dc=serendipity,dc=org
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: Sean
sn: Doyle
mail: sean.doyle@serendipity.org
uid: sean.doyle
userPassword:: UGFzc3dvcmQxMg==

# robert.russo, users, serendipity.org
dn: uid=robert.russo,ou=users,dc=serendipity,dc=org
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: Robert
sn: Russo
mail: robert.russo@serendipity.org
uid: robert.russo
userPassword:: UGFzc3dvcmQxMg==

# Team_Leader, groups, serendipity.org
dn: cn=Team_Leader,ou=groups,dc=serendipity,dc=org
objectClass: top
objectClass: groupOfUniqueNames
cn: Team_Leader
ou: Team_Leader
uniqueMember: uid=rob.ferguson,ou=users,dc=serendipity,dc=org

# Team_Member, groups, serendipity.org
dn: cn=Team_Member,ou=groups,dc=serendipity,dc=org
objectClass: top
objectClass: groupOfUniqueNames
cn: Team_Member
ou: Team_Member
uniqueMember: uid=rob.ferguson,ou=users,dc=serendipity,dc=org
uniqueMember: uid=sean.doyle,ou=users,dc=serendipity,dc=org
uniqueMember: uid=robert.russo,ou=users,dc=serendipity,dc=org

# search result
search: 2
result: 0 Success
```

### LDAP Browser

You can also use an LDAP browser to manage OpenLDAP.

## ❯ References

### OpenLDAP

* Docker Hub: [Bitnami container image for OpenLDAP](https://hub.docker.com/r/bitnami/openldap)
