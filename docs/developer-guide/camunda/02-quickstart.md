# Quickstart

## Camunda 8 Self-Managed

### Install the distribution

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

## Authentication

### Orchestration API

To disable REST API authentication in Docker Compose, you need to enable 'unprotected API mode', in the Orchestration
cluster's `application.yaml`:

```
camunda:
  security:
    authentication:
      method: "oidc"
      unprotectedApi: true
    authorizations:
      enabled: false
```

To check that REST API authentication has been disabled, run:

```
curl -s GET 'http://localhost:8080/v2/topology' \
  -H "Accept: application/json"  | jq .
```

## form-js

### Include the library

```
npm install @bpmn-io/form-js-viewer
```

## Add stylesheets

You use the `styles` array inside the build target in `angular.json` to list files you want to include when building
your project:

```
  "styles": [
  
    ...
    
    "./node_modules/@bpmn-io/form-js-viewer/dist/assets/form-js.css"
  ]
```

You can override global styles in the Serendipity PWA's `styles.css`, for example:

```
@use 'form-js-styles' as formJS;

contact, account {
  @include formJS.styles();
}
```

## bpmn-js

### Include the library

```
npm install bpmn-js
```

## References

### Camunda
* GitHub: [Camunda distributions](https://github.com/camunda/camunda-distributions/releases)
* Camunda docs: [Developer quickstart with Docker Compose](https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/)
* Camunda docs: [Configure Docker Compose environments](https://docs.camunda.io/docs/next/self-managed/quickstart/developer-quickstart/docker-compose/configuration/)
