---
sidebar_label: Configure
---

# Configure Docker Compose environments

## Choose a Docker Compose configuration

We provide the following Docker Compose configurations:

| Component                   | Description                                        |
|:----------------------------|:---------------------------------------------------|
| docker-compose.yml          | Default lightweight **development** configuration. |
| docker-compose-full.yml     | Full **development** configuration.                |
| docker-compose-try.yml      | Default **try** configuration.                     |
| docker-compose-try-full.yml | Full **try** configuration.                        |

To start a specific configuration, run one of the following commands:

* Default lightweight development configuration:

```
docker compose up -d
```

* Full development configuration:

```
docker compose -f docker-compose-full.yaml up -d
```

To stop all containers and remove associated data, run one of the following commands:

* Default lightweight development configuration:

```
docker compose down -v
```

* Full development configuration:

```
docker compose -f docker-compose-full.yaml down -v
```

## Serendipity components

| Component             | URL                                      | Description                                                                                            |
|:----------------------|:-----------------------------------------|:-------------------------------------------------------------------------------------------------------|
| PWA                   | https://serendipity.localhost            | Manage Accounts and Contacts. Access the PWA with `hey@rob-ferguson.me / secret`.                      |
| Identity&nbsp;Service | https://serendipity.localhost/auth/admin | Manage users, applications, roles, and groups. Access the Identity Service with `temp-admin / secret`. |

### External dependencies

| Component  | URL                                   | Description                                                                        |
|:-----------|:--------------------------------------|:-----------------------------------------------------------------------------------|
| pgadmin    | https://serendipity.localhost/pgadmin | pgAdmin is a free, open-source graphical management tool for PostgreSQL databases. |

## Camunda components

#### Access components

Once the containers are running, you can access the components in your browser.

Use the following default credentials for the web interfaces:

* Username: demo
* Password: demo

### Orchestration cluster

The Orchestration cluster provides process automation capabilities.

| Component                                     | URL                            | Description                                                    |
|:----------------------------------------------|:-------------------------------|:---------------------------------------------------------------|
| Operate                                       | http://localhost:8080/operate  | Monitor and troubleshoot process instances.                    |
| Tasklist                                      | http://localhost:8080/tasklist | Complete user tasks in running process instances.              |
| Orchestration Cluster Admin                   | http://localhost:8080/admin    | Manage users and permissions in the lightweight configuration. |
| Orchestration&nbsp;Cluster&nbsp;REST&nbsp;API | http://localhost:8080/v2       | REST API for process automation.                               |
| Swagger UI                                    | http://localhost:8080/swagger  | Swagger UI.                                                    |

### Management and modelling components

The following components are available in the full configuration only:

| Component           | URL                   | Description                                          |
|:--------------------|:----------------------|:-----------------------------------------------------|
| Console             | http://localhost:8087 | Manage clusters and component configurations.        |
| Optimize            | http://localhost:8083 | Analyze and improve process performance.             |
| Management Identity | http://localhost:8084 | Manage users for Console, Optimize, and Web Modeler. |
| Web Modeler         | http://localhost:8070 | Model BPMN processes, DMN decisions, and forms.      |

### External dependencies

| Component     | URL                          | Description                                                                                         |
|:--------------|:-----------------------------|:----------------------------------------------------------------------------------------------------|
| Elasticsearch | http://localhost:9200        | Used by the Orchestration cluster for secondary storage, and by Optimize in the full configuration. |
| Keycloak      | http://localhost:18080/auth/ | OIDC provider for Management Identity. Access Keycloak with `admin / admin`.                        |
| PostgreSQL    | http://localhost:5432        | Database for Management Identity and Web Modeler.                                                   |

### Authentication

- Web UI: Log in to Operate, Tasklist, Console, Optimize, and Web Modeler with `demo / demo`.
- APIs: Authentication for the Orchestration Cluster REST API has been disabled (i.e., set to 'unprotected API mode' in
  the Orchestration cluster's `application.yaml`).

### Importing a ZIP File into the Web Modeler

There are two ways to load a packaged process application (`.zip` file) into the Web Modeler:

Option 1: Import via URL

This method lets you import directly from a publicly hosted `.zip` file.

Host your .zip file at a **publicly accessible URL** (e.g., on GitHub).
Form the import URL like this:

```
<Web Modeler host>/import/resources?source=<raw zip file URL>
```

For example:

```
http://localhost:8070/import/resources?source=https://raw.githubusercontent.com/Robinyo/serendipity/refs/heads/main/backend/services/camunda/case-management/case-management.zip
```

Open that URL in your browser — Web Modeler will present the resources for import.
If the `.zip` contains at least one BPMN file, Web Modeler will automatically treat the contents as a **process application**
and group them accordingly.

Limits to keep in mind:
- Max .zip size: **10 MB**
- Max files in the archive: **100**
- Max size per individual file: **3 MB**

Option 2: Upload Files Manually

If you already have the .zip downloaded and extracted locally:

- Create a new **Process Application** in Web Modeler. <br />
- Inside the process application, click **Create new > Upload files**. <br />
- Select the extracted files from your computer and click **Upload**. <br />
- Delete the auto-generated empty BPMN diagram if it's not needed. <br />

:::tip

The "Upload files" method does not accept .zip files directly — you need to extract the contents first and upload the individual files.

:::
