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

### Kubernetes

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

### Docker 

To serve the applications:

```
docker-compose up -d
```

The containers may take a minute or two to startup.

Navigate to: http://127.0.0.1:8080

You can stop the containers using the following command:

```
docker-compose down -v
```
