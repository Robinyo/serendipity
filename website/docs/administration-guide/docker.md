# Docker and Docker Compose

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
docker container exec serendipity-web-bff printenv SERENDIPITY_HOSTNAME
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
  serendipity-web-bff | grep SPRING
```

To print logs:

```
docker container logs [name]
```

For example:

```
docker container logs nginx
docker container logs serendipity-identity-service
docker container logs serendipity-party-service
docker container logs serendipity-storage-service
docker container logs serendipity-web-bff
docker container logs pgadmin

docker logs --tail 100 nginx
docker logs --tail 100 serendipity-identity-service
```

To start a shell session inside your container that you can interact with through your terminal:

```
docker container exec -it [name] /bin/bash
```

`-i` is short for `--interactive`. Keep STDIN open even if unattached.
`-t` is short for `--tty`. Allocates a [pseudo terminal](http://en.wikipedia.org/wiki/Pseudo_terminal) that connects your terminal with the container’s STDIN and STDOUT.

For example:

```
docker container exec -it serendipity-web-bff
```

You can stop a container using the following command:

```
docker container stop [name]
```

For example:

```
docker container stop pgadmin
```

You can remove a container using the following command:

```
docker container rm [name]
```

For example:

```
docker container rm pgadmin
```

Where is your image? It’s in your machine’s local Docker image registry:

```
docker image ls
```

Misc:

```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name_or_id>
docker container ps -a
docker container ls
docker image ls
docker volume ls
```
