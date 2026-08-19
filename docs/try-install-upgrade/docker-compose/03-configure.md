---
sidebar_label: Configure
---

# Configure Docker Compose environments

## Choose a Docker Compose configuration

We provide the following Docker Compose configurations:

| Component                    | Description                        |
|:-----------------------------|:-----------------------------------|
| docker-compose.yaml          | Default lightweight configuration. |
| docker-compose-full.yaml     | Full configuration.                |
| docker-compose-try.yaml      | Default try configuration.         |
| docker-compose-try-full.yaml | Default try full configuration.    |

To start a specific configuration, run one of the following commands:

* Default lightweight configuration:

```
docker compose up -d
```

* Full configuration:

```
docker compose -f docker-compose-full.yaml up -d
```

## Access components

Once the containers are running, you can access the components in your browser.

Use the following default credentials for web interfaces:

* Username: demo
* Password: demo


| Component | URL                           | Description                   |
|:----------|:------------------------------|:------------------------------|
| PWA       | https://serendipity.localhost | Manage Accounts and Contacts. |
