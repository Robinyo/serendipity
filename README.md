<p align="center">
  <img src="./serendipity-logo.svg" alt="Serendipity" width="400"/>
</p>

<h1 align="center">Serendipity 3.0</h1>

<p align="center">
  Serendipity is an open-source Customer Engagement Platform. </br>
  You can use it to transform your organisation by connecting your customers, products, people and operations. </br>
</p>

<p align="center">
  TLS is used to encrypt <b>data in transit</b> and AES to encrypt <b>data at rest</b>.
</p>

<p align="center">
  OpenID Connect is used for authentication and OAuth 2.0 for authorisation. <br>
</p>

![divider](./divider.png)

## ❯ Architecture

Serendipity is composed of the following components:

- **Progressive Web App**
- **Backend for Frontend**
- **Identity Service**
- **Microservices**

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/docs/screen-shots/context-diagram.png">
</p>

## ❯ Documentation

* Developer Documentation
    * [Quick Start Guide](./docs/developer/quick-start-guide/README.md)
    * [mkcert](./docs/developer/mkcert/README.md)
* Administrator Documentation
    * [Working with APISIX](./docs/administrator/apisix/README.md)
    * [Working with Docker and Docker Compose](./docs/administrator/docker/README.md)
    * [Working with Keycloak](./docs/administrator/keycloak/README.md)
    * [Working with PostgreSQL](./docs/administrator/postgres/README.md)
    * [Working with pgAdmin](./docs/administrator/pgadmin/README.md)
    * [Working with the Percona Distribution for PostgreSQL](./docs/administrator/percona-distribution-for-postgresql/README.md)

![divider](./divider.png)

## ❯ References

### System Hardening

* Australian Signals Directorate: [Implementing Certificates, TLS, HTTPS and Opportunistic TLS](https://www.cyber.gov.au/resources-business-and-government/maintaining-devices-and-systems/system-hardening-and-administration/web-hardening/implementing-certificates-tls-https-and-opportunistic-tls)
* Cloudflare docs: [Cipher suites recommendations](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/recommendations/)

### OAuth 2.0

* IETF: [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
* IETF: [OAuth 2.0 Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693)
* IETF: [The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
* IETF: [Resource Indicators for OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc8707)
* IETF: [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
* IETF: [JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens](https://datatracker.ietf.org/doc/html/rfc9068)
* IETF: [OAuth 2.0 Dynamic Client Registration Protocol](https://datatracker.ietf.org/doc/html/rfc7591)
* IETF: [OAuth 2.0 for Browser-Based Applications](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)
* Spring docs: [Implementation Guidelines for Browser-Based Applications](https://github.com/spring-projects/spring-authorization-server/issues/297#issue-896744390)

### Keycloak

* Keycloak docs: [Configuring Keycloak for production](https://www.keycloak.org/server/configuration-production)
* Keycloak docs: [Configuring TLS](https://www.keycloak.org/server/enabletls)
* Keycloak docs: [Configuring trusted certificates](https://www.keycloak.org/server/keycloak-truststore)
* Keycloak docs: [Configuring the hostname](https://www.keycloak.org/server/hostname)
* Keycloak docs: [Using a reverse proxy](https://www.keycloak.org/server/reverseproxy)
* Keycloak docs: [Running Keycloak in a container](https://www.keycloak.org/server/containers)
* Keycloak docs: [Migrating to the Quarkus distribution](https://www.keycloak.org/migration/migrating-to-quarkus)
* Keycloak docs: [Upgrading Guide - 26.1.0](https://www.keycloak.org/docs/latest/upgrading/)
* Keycloak docs: [Authorization Services Guide](https://www.keycloak.org/docs/latest/authorization_services/index.html)

### Keycloak-based  Development

* GitHub: [Keycloak Project Example](https://github.com/thomasdarimont/keycloak-project-example)
* GitHub: [Awesome Keycloak](https://github.com/thomasdarimont/awesome-keycloak)

### Keycloak Support

* Google Group: [Keycloak User](https://groups.google.com/g/keycloak-user)
* Google Group: [Keycloak Dev](https://groups.google.com/g/keycloak-dev)

### APISIX

* APISIX: [Documentation](https://apisix.apache.org/docs/)
* APISIX docs: [Deployment modes](https://apisix.apache.org/docs/apisix/deployment-modes/#standalone)
* APISIX docs: [SSL Protocol](https://apisix.apache.org/docs/apisix/ssl-protocol/)
* APISIX docs: [Certificate](https://apisix.apache.org/docs/apisix/certificate/)
* APISIX docs: [openid-connect plugin](https://apisix.apache.org/docs/apisix/plugins/openid-connect/)
* APISIX docs: [authz-keycloak plugin](https://apisix.apache.org/docs/apisix/plugins/authz-keycloak/)
* API7 docs: [authz-keycloak plugin](https://docs.api7.ai/hub/authz-keycloak)
* APISIX docs: [Code Samples](https://apisix.apache.org/docs/general/code-samples/)

### Nginx

* Nginx docs: [NGINX SSL Termination](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)
* Nginx docs: [Authentication Based on Subrequest Result](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/)
