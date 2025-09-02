<h1 align="center">Quick Start Guide</h1>

### Clone the project

Change the current working directory to the location where you want the cloned project to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone git@github.com:Robinyo/serendipity.git
``` 

### Enable TLS

#### Local Development

Follow the steps in the project's Developer Documentation to use [mkcert](../mkcert/README.md) to create and install a 
local certificate authority and to generate the certificates required to enable TLS.

### Development

To build the **frontend**:

```
# In the project's /frontend directory

ng build --configuration="development" utils-lib && \
ng build --configuration="development" serendipity-pwa
```

To build the **backend** services:

The build supports the following Maven project profiles: dev and test.

```
# In the project's /backend directory

mvn clean install spring-boot:repackage

# or

mvn clean install -DskipTests=true spring-boot:repackage

# or

mvn clean install -Pdev spring-boot:repackage
mvn clean install -Ptest spring-boot:repackage
```

**Note:** `dev` is the active by default profile.

To build the project:

```
docker compose build
```


#### Docker Compose

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

To check the environment variables inside your container:

```
docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  serendipity-identity-server

docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  serendipity
```

To check the logs inside your container:

```
docker container logs postgres
docker container logs pgadmin
docker container logs serendipity-identity-server
docker container logs serendipity-party-service
docker container logs serendipity-work-service
docker container logs serendipity-pwa
```
