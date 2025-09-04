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

ng build --configuration="development" utils-lib && \
ng build --configuration="development" serendipity-pwa
```

To build the **backend** services:

```
# In the project's /backend directory

mvn clean install spring-boot:repackage

# or

mvn clean install -DskipTests=true spring-boot:repackage
```

**Note:** `dev` is the active by default profile.

The build supports the following Maven project profiles: dev and test.

```
# In the project's /backend directory

mvn clean install -Pdev spring-boot:repackage
mvn clean install -Ptest spring-boot:repackage
```

To build the project:

```
docker system prune && \
docker container prune && docker volume prune && docker network prune

docker compose build
```

### Docker Compose

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

To remove the services:

```
docker compose down
```

To remove the data volumes:

```
docker volume rm backend_postgres_data
```
