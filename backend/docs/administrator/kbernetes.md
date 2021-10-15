<h1 align="center">Kubernetes</h1>

We use Docker Desktop for Mac.

Right-click the whale icon, go to Preferences and enable Kubernetes from the Kubernetes tab.

Click Apply & Restart, and wait a few minutes while Docker Desktop starts up your Kubernetes cluster.

You can view your cluster using the following command:

```
kubectl get nodes

NAME             STATUS   ROLES    AGE    VERSION
docker-desktop   Ready    master   8m1s   v1.19.7
```

kubectl is the main Kubernetes command-line tool, you’ll use it for most Kubernetes management tasks.

The kubectl configuration file is called config (aka kubeconfig) and lives in a hidden directory called kube in your 
home directory ($HOME/.kube/config).
