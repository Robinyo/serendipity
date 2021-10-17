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

mvn clean install -Pdev spring-boot:repackage
mvn clean install -Ptest spring-boot:repackage
```

**Note:** `dev` is the active by default profile.

To build the project:

```
docker-compose build
```


#### Kubernetes

To serve the applications:

```
kubectl create configmap serendipity-identity-server-configmap --from-file serendipity-identity-server-configmap.yaml
kubectl create configmap serendipity-configmap --from-file serendipity-configmap.yaml

kubectl apply -f serendipity-identity-server-deployment.yaml -f serendipity-identity-server-service.yaml
kubectl apply -f serendipity-deployment.yaml -f serendipity-service.yaml

```

The containers may take a minute or two to startup.

Navigate to: http://127.0.0.1:30001

You can stop the containers using the following command:

```
kubectl delete -f serendipity-deployment.yaml -f serendipity-service.yaml
kubectl delete -f serendipity-identity-server-deployment.yaml -f serendipity-identity-server-service.yaml
```

To ...

```
kubectl get pods
```

To delete the configMaps:

```
kubectl delete configmap serendipity-configmap -n default
kubectl delete configmap serendipity-identity-server-configmap -n default
```







 
#### Docker 

To serve the applications:

```
docker-compose up -d
```

The containers may take a minute or two to startup.

Navigate to: http://127.0.0.1:8080

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
docker container logs serendipity-identity-server
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
