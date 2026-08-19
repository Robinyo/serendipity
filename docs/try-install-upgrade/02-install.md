# Install

## Docker images

We provide [official Docker images](https://hub.docker.com/u/robinyo) for all major components.

## Docker images vs Docker Compose

Docker images are suitable for production deployments.

The provided [Docker Compose files](./docker-compose/02-install.md) are for development and testing.

For production, we recommend using Kubernetes with Helm.

## Platform support

* Use the `linux/arm64` or `linux/amd64` image for production environments.
* All images are publicly accessible.

Docker images are supported for production only on Linux systems. Windows and macOS are supported for development 
environments only.
