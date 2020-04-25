<h1 align="center">Quick Start</h1>

## ❯ Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Open a terminal window and install [Node.js (and npm)](https://nodejs.org/en/download/) and [git](https://git-scm.com/) if they are not already on your machine.

> Verify that you are running at least Node.js version 8.x or greater and npm version 5.x or greater by running node -v and npm -v in a terminal/console window. Older versions produce errors, but newer versions are fine.

Then install the Angular CLI globally:

```
npm install -g @angular/cli
```

The [Angular CLI](https://cli.angular.io/) is a command line tool that you can use to create the scaffolding for a new project, add files to a project and perform a variety of common development tasks.

## ❯ Step 2: Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity
cd serendipity
```

## ❯ Step 3: Serve the application's API 

Follow the steps in the Serendipity API's [Quick Start](https://github.com/Robinyo/serendipity-api/blob/master/projects/spring-boot/docs/developer.md) Guide.

## ❯ Step 4: Serve the application 

Install the project's dependencies and launch the application:

```
# In the project directory: /serendipity

npm install

ng build utils && \
ng build serendipity-components && \
ng build auth && \
ng build auth-oidc && \
ng build auth-auth0 && \
ng build auth-okta && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build auth-local && \
ng build flowable && \
ng build sales

ng serve --proxy-config=proxy.conf.json --open
```

The ng serve command launches the server, watches your files, and rebuilds the app as you make changes to those files.

Using the --open (or just -o) option will open your browser on `http://localhost:4200/`

Register page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-register.png">
</p>

Login page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-login.png">
</p>

![divider](../divider.png)

## ❯ Docker Commands

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

![divider](../divider.png)
