<h1 align="center">Working with OpenLDAP</h1>

## ❯ Bitnami container image for OpenLDAP

### Docker Compose

Using Docker Compose to launch your PostgreSQL database and supporting services is a straightforward process.

You need to specify a PostgreSQL image, define environment variables for database credentials, volumes for persistent 
storage, and port mapping for external access.

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
      - LDAP_ADMIN_USERNAME=admin
      - LDAP_ADMIN_PASSWORD=secret
      - LDAP_ROOT=dc=flowable,dc=org
      - LDAP_ADMIN_DN=cn=admin,dc=flowable,dc=org
      - LDAP_SKIP_DEFAULT_TREE=yes
      - LDAP_CUSTOM_LDIF_DIR=/opt/bitnami/openldap/custom-ldifs
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

### LDAP Browser

You can also use an [LDAP Browser](https://directory.apache.org/studio/) to manage OpenLDAP.



## ❯ References

### OpenLDAP

* Docker Hub: [Bitnami container image for OpenLDAP](https://hub.docker.com/r/bitnami/openldap)
