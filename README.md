<p align="center">
  <img src="./serendipity-logo.svg" alt="Serendipity" width="400"/>
</p>

<h1 align="center">Serendipity 2.0</h1>

<p align="center">
  <b>Serendipity is an open-source Customer Engagement Platform.</b></br>
  <b>You can use it to transform your organisation by connecting your customers, products, people and operations.</b></br>
</p>

![divider](./divider.png)


## ❯ Features

- **Progressive Web App (PWA)**
- **Backend for Frontend (BFF)**
- **Spring Security 5 OAuth 2.0 Login (Authorization Code flow)**
- **Lazy-loading Feature Modules**
- **Support for Webpack Module Federation**

![divider](./divider.png)

## ❯ Quick Start

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity-2.0
cd serendipity-2.0/backend
``` 

### Kubernetes

To serve the applications:

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

### Docker

To serve the applications:

```
docker-compose up -d
```

The containers may take a minute or two to startup.

Navigate to: http://127.0.0.1:8080

## ❯ Docker Hub

See: https://hub.docker.com/u/robinyo

## ❯ Links

[Documentation, demos, and guides](./docs/README.md)

## ❯ Screen Shots

Welcome Page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/docs/screen-shots/welcome-page.png">
</p>

Sidenav:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/docs/screen-shots/sidenav.png">
</p>

![divider](./divider.png)
