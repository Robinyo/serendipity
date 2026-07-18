<h1 align="center">Quick Start Guide</h1>

## ❯ Set up your Development Environment

* [Frontend Build Management](../build-management/frontend/README.md)
* [Backend Build Management](../build-management/backend/README.md)

## ❯ Clone the project

Change the current working directory to the location where you want the cloned project to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone git@github.com:Robinyo/serendipity.git
``` 

## ❯ Enable TLS

### Local Development

Follow the steps in the project's Developer Documentation to use [mkcert](../mkcert/README.md) to create and install a 
local certificate authority and to generate the certificates required to enable TLS.

## ❯ Development

To build the **frontend**:

```
# In the project's /frontend directory

npm install

ng build --configuration="development" serendipity-auth-lib && \
ng build --configuration="development" serendipity-utils-lib && \
ng build --configuration="development" serendipity-components-lib && \
ng build --configuration="development" serendipity-dynamic-forms-lib && \
ng build --configuration="development" serendipity-flowable-lib && \
ng build --configuration="development" serendipity-party-lib && \
ng build --configuration="development" serendipity-work-lib && \
ng build --configuration="development" serendipity-pwa
```

To build the **backend** services:

```
# In the project's /backend directory

mvn clean install spring-boot:repackage
```

### Docker Compose

To build the project:

```
docker system prune && \
docker container prune && docker volume prune && docker network prune

export DOCKER_DEFAULT_PLATFORM=linux/arm64

docker compose build
```

With a single command, you can create and start all the services:

```
docker compose up
```

The containers may take a minute or two to startup.

**Note:** Docker Compose will look for an `.env` file in the current working directory.

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
docker compose down -v
```

Note: The `-v` flag deletes all volumes, including process data, users, and other persisted state. Omit `-v` if you want to keep your data.

### Camunda 8 Self-Managed

#### Access components

Once the containers are running, you can access the components in your browser.

Use the following default credentials:

```
Username: demo
Password: demo
```

#### Orchestration Cluster

The Orchestration Cluster is the core of Camunda 8 and provides process automation capabilities.

| Component                      | URL                            | Description                                                    |
|:-------------------------------|:-------------------------------|:---------------------------------------------------------------|
| Operate                        | http://localhost:8080/operate  | Monitor and troubleshoot process instances.                    |
| Tasklist                       | http://localhost:8080/tasklist | Complete user tasks in running process instances.              |
| Orchestration Cluster Admin    | http://localhost:8080/admin    | Manage users and permissions in the lightweight configuration. |
| Orchestration Cluster REST API | http://localhost:8080/v2       | REST API for process automation.                               |
| Swagger UI                     | http://localhost:8080/swagger  | Swagger UI.                                                    |

#### Management and modeling components

The following components are available in the full configuration only:


| Component           | URL                   | Description                                          |
|:--------------------|:----------------------|:-----------------------------------------------------|
| Console             | http://localhost:8087 | Manage clusters and component configurations.        |
| Optimize            | http://localhost:8083 | Analyze and improve process performance.             |
| Management Identity | http://localhost:8084 | Manage users for Console, Optimize, and Web Modeler. |
| Web Modeler         | http://localhost:8070 | Model BPMN processes, DMN decisions, and forms.      |

#### External dependencies

| Component     | URL                          | Description                                                                                        |
|:--------------|:-----------------------------|:---------------------------------------------------------------------------------------------------|
| Elasticsearch | http://localhost:9200        | Used by the Orchestration Cluster as secondary storage, and by Optimize in the full configuration. |
| Keycloak      | http://localhost:18080/auth/ | OIDC provider for Management Identity. Access Keycloak with admin / admin.                         |
| PostgreSQL    | http://localhost:5432        | Database for Management Identity and Web Modeler.                                                  |

#### Authentication

- Web UI: Log in to Operate, Tasklist, Console, Optimize, and Web Modeler with `demo / demo`.
- APIs: Authentication for the Orchestration Cluster REST API has been disabled.
