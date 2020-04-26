<h1 align="center">Working with Docker and Docker Compose</h1>

Docker CLI management commands start with `docker`, then a space, then the management category, then a space, and then 
the command. A flag with two dashes in front is the full name of the flag. A flag with one dash is a shortcut for the 
full flag name.

To list all running containers:

```
docker container ls
```

To check an environment variable inside your container:

```
docker exec [name] printenv [variable]
```

For example:

```
docker exec flowable printenv FLOWABLE_IDM_LDAP_ENABLED
```

To check the environment variables inside your container:

```
docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  [name] | grep [value]
```

For example:

```
docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  flowable | grep FLOW
```

To print logs:

```
docker logs [name]
```

For example:

```
docker logs flowable
docker logs keycloak
docker logs openldap
```

To start a shell session inside your container that you can interact with through your terminal:

```
docker exec -it [name] /bin/bash
```

`-i` is short for `--interactive`. Keep STDIN open even if unattached.
`-t` is short for `--tty`. Allocates a [pseudo terminal](http://en.wikipedia.org/wiki/Pseudo_terminal) that connects your terminal with the container’s STDIN and STDOUT.

For example:

```
docker exec -it flowable sh
```

You can stop a container using the following command:

```
docker container stop [name]
```

For example:

```
docker container stop flowable
docker container stop keycloak
docker container stop openldap
```

You can remove a container using the following command:

```
docker container rm [name]
```

For example:

```
docker container rm flowable
docker container rm keycloak
docker container rm openldap
```

Where is your image? It’s in your machine’s local Docker image registry:

```
docker image ls
```
