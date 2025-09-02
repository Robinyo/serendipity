<h1 align="center">Backend Build Management</h1>

## ❯ Set up your Development Environment

You need to set up your development environment before you can do anything.

What you need:

* git
* Java JDK 21 or later
* Maven 3.9.11 or later

### Java JDK

#### macOS

Homebrew tap AdoptOpenJDK/openjdk is officially deprecated in favor of the temurin casks provided directly from the Homebrew project.
Homebrew is the best way to manage and work with different Java versions.

For example:

```
brew update
brew upgrade
brew install --cask temurin@21
```

Update your .zshrc:

```
export JAVA_11_HOME=$(/usr/libexec/java_home -v11)
export JAVA_17_HOME=$(/usr/libexec/java_home -v17)
export JAVA_21_HOME=$(/usr/libexec/java_home -v21)
export JAVA_24_HOME=$(/usr/libexec/java_home -v24)

alias java11='export JAVA_HOME=$JAVA_11_HOME'
alias java17='export JAVA_HOME=$JAVA_17_HOME'
alias java21='export JAVA_HOME=$JAVA_21_HOME'
alias java24='export JAVA_HOME=$JAVA_24_HOME'

java21
```

To check your Java version:

```
source ~/.zshrc
java -version
```

You should see something like:

```
openjdk version "21.0.6" 2025-01-21 LTS
OpenJDK Runtime Environment Temurin-21.0.6+7 (build 21.0.6+7-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.6+7 (build 21.0.6+7-LTS, mixed mode, sharing)
```

To check for installed Java SDKs:

```
/usr/libexec/java_home -V
```

You should see something like:

```
Matching Java Virtual Machines (4):
24.0.2 (arm64) "Eclipse Adoptium" - "OpenJDK 24.0.2" /Library/Java/JavaVirtualMachines/temurin-24.jdk/Contents/Home
21.0.8 (arm64) "Eclipse Adoptium" - "OpenJDK 21.0.8" /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
17.0.16 (arm64) "Eclipse Adoptium" - "OpenJDK 17.0.16" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
11.0.28 (arm64) "Eclipse Adoptium" - "OpenJDK 11.0.28" /Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home
```

### Development

To build the backend services:

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

## ❯ References

* Apache docs: [Maven](https://maven.apache.org/guides/index.html)
* Spring Boot docs: [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.5/maven-plugin)
* Spring Boot docs: [Create an OCI image](https://docs.spring.io/spring-boot/3.5.5/maven-plugin/build-image.html)
* Spring Boot docs: [OAuth2 Client](https://docs.spring.io/spring-boot/3.5.5/reference/web/spring-security.html#web.security.oauth2.client)
* Spring Boot docs: [Spring Boot Actuator](https://docs.spring.io/spring-boot/3.5.5/reference/actuator/index.html)

## ❯ Additional Resources

* GitHub: [Checking for existing SSH keys](https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys)
* GitHub: [Generating a new SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
* GitHub: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
* GitHub: [Testing your SSH connection](https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection)
* GitHub: [Switching remote URLs from HTTPS to SSH](https://docs.github.com/en/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh)
