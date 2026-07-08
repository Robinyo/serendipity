<h1 align="center">Working with Camunda</h1>

## ❯ Camunda 8 Self-Managed

### Docker Compose

See: https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/

```
# Download Docker Compose artifact.
curl -LO https://github.com/camunda/camunda-distributions/releases/download/docker-compose-8.9/docker-compose-8.9.zip
# Download Docker Compose Cosign bundle.
curl -LO https://github.com/camunda/camunda-distributions/releases/download/docker-compose-8.9/docker-compose-8.9.cosign.bundle
# Verify with cosign.
cosign verify-blob docker-compose-8.9.zip \
  --bundle docker-compose-8.9.cosign.bundle \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  --certificate-identity "https://github.com/camunda/camunda-distributions/.github/workflows/docker-compose-release-template.yaml@refs/heads/main"
```

## ❯ References

### Flowable

* GitHub: [Developer quickstart with Docker Compose](https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/)
