<h1 align="center">Quick Start Guide</h1>

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

### Docker 

To serve the applications (from the /backend directory):

```
docker-compose up -d
```

The containers may take a minute or two to startup.

Navigate to: http://127.0.0.1:8080

You can stop the containers using the following command:

```
docker-compose down -v
```

### Kubernetes

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

You can stop the containers using the following command:

```
kubectl delete -n serendipity -f serendipity-identity-server.yaml
kubectl delete -n serendipity -f serendipity.yaml
```
