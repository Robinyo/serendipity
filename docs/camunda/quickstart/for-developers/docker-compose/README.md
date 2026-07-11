<h1 align="center">Developer quickstart with Docker Compose</h1>

## ❯ Camunda 8 Self-Managed

### Install and start with Docker Compose

1. Download the latest Camunda 8 Docker Compose [distribution](https://github.com/camunda/camunda-distributions/releases), then extract it.

For example:

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

2. Use Docker Compose's include feature to import the Camunda services:

```
include:
  - path: ./services/camunda/docker-compose/8.9/docker-compose-full.yaml
    env_file: ./services/camunda/docker-compose/8.9/.env

services:
  ...

```

In the extracted directory, run:

docker compose up -d

Wait for the environment to initialize. This can take several minutes. If you use the full configuration, monitor the logs, especially the Keycloak container log, to ensure all components start.

## ❯ References

### Camunda
* GitHub: [Camunda distributions](https://github.com/camunda/camunda-distributions/releases)
* Camunda docs: [Developer quickstart with Docker Compose](https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/)
