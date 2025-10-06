<h1 align="center">Bitnami</h1>

## ❯ Bitnami

```
  openldap:
    container_name: openldap
    build:
      context: ./services/openldap/bitnami
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