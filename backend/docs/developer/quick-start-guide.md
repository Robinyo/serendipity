<h1 align="center">Quick Start Guide</h1>

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

What you need:

* JDK 11 or later
* Maven 3.2 or later

### Step 2: Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity-2.0
cd serendipity-2.0/backend
``` 

### Step 3: Serve the application

To run a multi-container application with the Docker CLI, you use the `docker-compose up` command. 
This command uses the project's docker-compose.yml file to deploy a multi-container application:

```
# In the project's /backend directory

docker-compose up -d
```

The containers may take a minute or two to startup.

Navigate to `http://localhost:8080/`

You can check the status of the containers using the following command:

```
docker-compose ps
```

To check the environment variables inside your container:

```
docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  serendipity-api
```

To check the logs inside your container:

```
docker container logs openldap
docker container logs keycloak
docker container logs postgres
docker container logs pgadmin
docker container logs serendipity-web-bff
```

You can stop the containers using the following command:

```
docker-compose down -v
```
