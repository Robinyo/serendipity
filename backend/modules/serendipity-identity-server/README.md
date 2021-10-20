<h1 align="center">Serendipity Identity Server (Keycloak)</h1>

### Misc
#### Specify frontend base URL
To set a fixed base URL for frontend requests use the following environment value (this is highly recommended in 
production):

```
# Specify base URL for Keycloak (optional, default is retrieved from request)
KEYCLOAK_FRONTEND_URL=http://127.0.0.1:30002/auth
```

Note: I could not find this environment variable mentioned in the Keycloak documentation. It is mentioned in the 
Keycloak Docker Hub [readme](https://hub.docker.com/r/jboss/keycloak/).
