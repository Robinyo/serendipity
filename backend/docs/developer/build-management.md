<h1 align="center">Build Management</h1>

### Set up the Development Environment

You need to set up your development environment before you can do anything.

What you need:

* git
* JDK 11 or later
* Maven 3.2 or later

### Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspace
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity-2.0
cd serendipity-2.0/backend
``` 

### Development

The build supports the following Maven project profiles: dev and test.

To build the application:

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
docker-compose build
```

#### Docker 

To serve the applications:

```
docker-compose up -d
```

The containers may take a minute or two to startup.

Navigate to: http://127.0.0.1:30001

You can stop the containers using the following command:

```
docker-compose down -v
```

You can check the status of the containers using the following command:

```
docker-compose ps
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
docker container logs serendipity
```

#### Docker Hub

To tag the images and push them to Docker Hub:

```
docker tag serendipity-identity-server robinyo/serendipity-identity-server:latest
docker tag serendipity robinyo/serendipity:latest
docker tag serendipity-party-service robinyo/serendipity-party-service:latest
docker tag serendipity-work-service robinyo/serendipity-work-service:latest

docker push robinyo/serendipity-identity-server:latest
docker push robinyo/serendipity:latest
docker push robinyo/serendipity-party-service:latest
docker push robinyo/serendipity-work-service:latest
```
 
#### Kubernetes

To serve the applications (from the /backend directory):

```
# Create a dedicated namespace for our deployments
kubectl create ns serendipity

# Deploy the Serendipty Identity Service
kubectl apply -n serendipity -f serendipity-identity-server.yaml

# Deploy the Serendipty PWA and BFF
kubectl apply -n serendipity -f serendipity.yaml
```

The containers may take a minute or two to startup.

Navigate to: http://127.0.0.1:30001

To list all the services in the 'serendipity' namespace:

```
kubectl get pods --namespace=serendipity
```

You should see output like:

```
NAME                                           READY   STATUS    RESTARTS   AGE
serendipity-69dbb67c9b-w8v7t                   1/1     Running   0          48m
serendipity-identity-server-75d8d4b79c-qqxdv   1/1     Running   0          73m
```

To check the logs:

```
kubectl logs <name> --namespace=serendipity
```

You can stop the containers using the following command:

```
kubectl delete -n serendipity -f serendipity-identity-server.yaml
kubectl delete -n serendipity -f serendipity.yaml
```

##### Kubernetes Dashboard

Follow these [steps](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) to deploy the 
Kubernetes Dashboard.

### Resources

* Spring Security 5: [OAuth 2.0 Login](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#oauth2login)

### Additional Resources

* Github: [Checking for existing SSH keys](https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys)
* Github: [Generating a new SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
* Github: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
* Github: [Testing your SSH connection](https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection)
* Github: [Switching remote URLs from HTTPS to SSH](https://docs.github.com/en/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh)
