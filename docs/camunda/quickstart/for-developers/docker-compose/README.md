<h1 align="center">Developer quickstart with Docker Compose</h1>

## ❯ Camunda 8 Self-Managed

### Install and start with Docker Compose

1. Download the latest Camunda 8 Docker Compose [distribution](https://github.com/camunda/camunda-distributions/releases), then extract it.

```
# In the project's /backend directory

mkdir /services/camunda/docker-compose/8.9
cd /services/camunda/docker-compose/8.9

# Download Docker Compose artifacts
curl -LO https://github.com/camunda/camunda-distributions/releases/download/docker-compose-8.9/docker-compose-8.9.zip

# Download Docker Compose Cosign bundle.
curl -LO https://github.com/camunda/camunda-distributions/releases/download/docker-compose-8.9/docker-compose-8.9.cosign.bundle

# Verify with cosign.
cosign verify-blob docker-compose-8.9.zip \
  --bundle docker-compose-8.9.cosign.bundle \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  --certificate-identity "https://github.com/camunda/camunda-distributions/.github/workflows/docker-compose-release-template.yaml@refs/heads/main"

unzip docker-compose-8.9.zip
```

2. Use Docker Compose's `include` element to import the Camunda services.

```
include:
  - path: ./services/camunda/docker-compose/8.9/docker-compose-full.yaml
    env_file: ./services/camunda/docker-compose/8.9/.env

services:
  ...

```

3. In the project's `/backend` directory, run:

```
docker compose up
```

The containers may take a minute or two to startup.

**Note:** Docker Compose will look for an `.env` file in the current working directory.

Navigate to:

```
https://serendipity.localhost
```

## ❯ References

### Camunda
* GitHub: [Camunda distributions](https://github.com/camunda/camunda-distributions/releases)
* Camunda docs: [Developer quickstart with Docker Compose](https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/)
* Camunda docs: [Configure Docker Compose environments](https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/configuration/)

