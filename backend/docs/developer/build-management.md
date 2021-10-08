<h1 align="center">Build Management</h1>

### Getting Started

Follow the steps in the [Quick Start Guide](https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/developer/quick-start-guide.md).

### Development

The build supports the following Maven project profiles: dev and test.

To build the API:

```
# In the project's /backend directory

mvn clean install spring-boot:repackage

# or

mvn clean install -Pdev spring-boot:repackage
mvn clean install -Ptest spring-boot:repackage
```

**Note:** `dev` is the active by default profile.

To build the project:

```
docker-compose build
```

To serve the applications:

```
docker-compose up -d
```

The containers may take a minute or two to startup.

Navigate to `http://localhost:8080`

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
docker container logs serendipity-identity-server
docker container logs postgres
docker container logs pgadmin
docker container logs serendipity-web-bff
```

You can stop the containers using the following command:

```
docker-compose down -v
```

### Additional Resources

* Github: [Checking for existing SSH keys](https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys)
* Github: [Generating a new SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
* Github: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
* Github: [Testing your SSH connection](https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection)
* Github: [Switching remote URLs from HTTPS to SSH](https://docs.github.com/en/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh)
