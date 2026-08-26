# Quickstart

## Building Spring Boot apps

To build the backend services:

```
# In the project's /backend directory

mvn clean install spring-boot:repackage

# or

mvn clean install -DskipTests=true spring-boot:repackage
```

:::info

`dev` is the active by default profile.

:::

The build supports the following Maven project profiles: dev and test.

```
# In the project's /backend directory

mvn clean install -Pdev spring-boot:repackage
mvn clean install -Ptest spring-boot:repackage
```

## Docker Compose

To build the project:

```
export DOCKER_DEFAULT_PLATFORM=linux/arm64
# export DOCKER_DEFAULT_PLATFORM=windows/amd64

docker compose build --no-cache
```

With a single command, you can create and start all the services:

```
docker compose up
```

The containers may take a minute or two to startup.

:::info

Docker Compose will look for an `.env` file in the current working directory.

:::

Navigate to:

```
https://serendipity.localhost
```

To stop the services:

```
docker compose stop
```

To remove the services and the associated data, run:

```
docker compose down -v --remove-orphans
# docker system df
# docker system prune --all --volumes --force
```

**Note:** The `-v` flag deletes all volumes, including process data, users, and other persisted state. Omit `-v` if you want to keep your data.

To check the environment variables inside your container:

```
docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  serendipity-bff
```

To check the logs inside your container:

```
docker container logs postgres
docker container logs pgadmin
docker container logs serendipity-identity-service
docker container logs serendipity-party-service
docker container logs serendipity-web-bff
docker container logs nginx

docker container logs orchestration
docker container logs connectors
docker container logs optimize
docker container logs identity
docker container logs postgres
docker container logs keycloak
docker container logs elasticsearch
docker container logs web-modeler-db
docker container logs mailpit
docker container logs web-modeler-restapi
docker container logs web-modeler-websockets
docker container logs console
```

## References

### Build Tools

* Apache docs: [Maven](https://maven.apache.org/guides/index.html)

### Spring Boot

* Spring Boot docs: [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.5/maven-plugin)
* Spring Boot docs: [Create an OCI image](https://docs.spring.io/spring-boot/3.5.5/maven-plugin/build-image.html)
* Spring Boot docs: [OAuth2 Client](https://docs.spring.io/spring-boot/3.5.5/reference/web/spring-security.html#web.security.oauth2.client)
* Spring Boot docs: [Spring Boot Actuator](https://docs.spring.io/spring-boot/3.5.5/reference/actuator/index.html)

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

## Additional Resources

* GitHub: [Checking for existing SSH keys](https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys)
* GitHub: [Generating a new SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
* GitHub: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
* GitHub: [Testing your SSH connection](https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection)
* GitHub: [Switching remote URLs from HTTPS to SSH](https://docs.github.com/en/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh)