<h1 align="center">Working with Docker and Docker Compose</h1>

We use Docker Desktop for Mac.

Docker CLI management commands start with `docker`, then a space, then the management category, then a space, and then 
the command. A flag with two dashes in front is the full name of the flag. A flag with one dash is a shortcut for the 
full flag name.

To list all running containers:

```
docker container ls
```

To check an environment variable inside your container:

```
docker container exec [name] printenv [variable]
```

For example:

```
docker container exec hapi-fhir printenv KC_HOSTNAME
```

To check the environment variables inside your container:

```
docker container inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  [name] | grep [value]
```

For example:

```
docker container inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  hapi-fhir | grep SPRING
```

To print logs:

```
docker container logs [name]
```

For example:

```
docker container logs postgres
docker container logs pgadmin

docker logs --tail 100 apisix
docker logs --tail 100 oauth2-proxy
docker logs --tail 100 keycloak
```

To start a shell session inside your container that you can interact with through your terminal:

```
docker container exec -it [name] /bin/bash
```

`-i` is short for `--interactive`. Keep STDIN open even if unattached.
`-t` is short for `--tty`. Allocates a [pseudo terminal](http://en.wikipedia.org/wiki/Pseudo_terminal) that connects your terminal with the container’s STDIN and STDOUT.

For example:

```
docker container exec -it hapi-fhir sh
```

You can stop a container using the following command:

```
docker container stop [name]
```

For example:

```
docker container stop postgres
docker container stop pgadmin
docker container stop keycloak
docker container stop hapi-fhir
```

You can remove a container using the following command:

```
docker container rm [name]
```

For example:

```
docker container rm postgres
docker container rm pgadmin
docker container rm keycloak
docker container rm hapi-fhir
```

Where is your image? It’s in your machine’s local Docker image registry:

```
docker image ls
```

Clean and build:

```
docker system prune
docker container prune && docker volume prune && docker network prune

# APISIX
docker compose -f docker-compose-apisix.yml build

# OR

# Nginx
docker compose -f docker-compose-nginx.yml build
```

Misc:

```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name_or_id>
docker container ps -a
docker compose -f docker-compose-apisix.yml ps
docker compose -f docker-compose-nginx.yml ps
docker container ls
docker image ls
docker volume ls
docker container prune && docker volume prune && docker network prune
```
