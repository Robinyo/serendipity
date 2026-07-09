<h1 align="center">Working with Camunda</h1>

## ❯ Camunda 8 Self-Managed

### Install and start with Docker Compose

1. Download the latest Camunda 8 Docker Compose [distribution](https://github.com/camunda/camunda-distributions/releases), then extract it.

For example:

```
# In the project's /backend directory

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

## ❯ References

### Camunda
* GitHub: [Camunda distributions](https://github.com/camunda/camunda-distributions/releases)
* Camunda docs: [Developer quickstart with Docker Compose](https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/)
