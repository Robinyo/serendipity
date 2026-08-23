# Configuration

NGINX sets up a secure reverse proxy for local development and testing. It handles HTTP-to-HTTPS redirection, 
SSL termination, and reverse proxy routing for backend services.

`nginx-default.conf.template`:

```
# 1. HTTP to HTTPS Global Redirector
server {

  server_name serendipity.localhost;
  listen 80;

  return 301 https://$host$request_uri;

}

# 2. Front-End and BFF Gateway Domain
server {

  server_name serendipity.localhost;
  listen 443 ssl default_server;

  ssl_certificate /etc/nginx/certs/cert.pem;
  ssl_certificate_key /etc/nginx/certs/key.pem;

  include /etc/nginx/conf/ssl.conf;

  location / {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Host $host;

      proxy_pass http://serendipity-web-bff:8080;
      proxy_redirect off;
  }

  4. Database Administration Routing
  location /pgadmin {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Host $host;
      proxy_pass http://pgadmin:80;
  }

}

# 3. Dedicated Identity Service (Keycloak) Domain
server {

  server_name serendipity-identity-service.localhost;
  listen 443 ssl;

  ssl_certificate /etc/nginx/certs/serendipity-identity-service-cert.pem;
  ssl_certificate_key /etc/nginx/certs/serendipity-identity-service-key.pem;

  include /etc/nginx/conf/ssl.conf;

  location / {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Port $server_port;
      proxy_set_header Host $host;

      proxy_pass http://serendipity-identity-service:8080;
      proxy_buffer_size 128k;
      proxy_buffers 4 256k;
      proxy_busy_buffers_size 256k;
  }

}

```

1. HTTP to HTTPS Global Redirector <br />
This block ensures that any unencrypted traffic hitting the application is immediately upgraded to a secure connection.
- **`server_name serendipity.localhost;`** Restricts this block to requests matching this local hostname.
- **`listen 80;`** Listens for unencrypted HTTP traffic on port 80.
- **`return 301 https://$host$request_uri;`** Issues a permanent redirect (301) that forces a web browser to 
  reconnect securely over HTTPS, preserving the hostname and exact URL path.

2. Front-End & BFF Gateway Domain <br />
This block is the primary application entry point, it serves the static Angular files via the BFF, terminates SSL, and 
acts as the central router.

- **`listen 443 ssl default_server;`** Listens for secure HTTPS traffic. It is marked as the fallback (default_server) 
  if an incoming request doesn't match any other block's rules.
- **`ssl_certificate ...;`** Loads the mkcert SSL certificates used to encrypt the connection between the browser and nginx.
- **`include /etc/nginx/conf/ssl.conf;`** Pulls in the shared global security settings (e.g., allowed TLS encryption 
  versions and modern cipher suites).
- **`proxy_pass http://serendipity-web-bff:8080;`** Forwards this traffic to the BFF running on port 8080 inside
  a Docker network.
- **`Headers:`** Forwards client details (IP, protocol) and keeps the original request Host header intact.
- **`proxy_redirect off;`** Prevents NGINX from modifying the Location headers in responses sent by the backend.


3. Dedicated Identity Service Domain (Keycloak) <br />
This block isolates Keycloak within its own subdomain.
- **`server_name serendipity-identity-service.localhost;`**  Listens for traffic meant for the Identity Service.
- **`ssl_certificate ...;`** Loads the mkcert SSL certificates used to encrypt the connection between the browser and nginx.
- **`proxy_pass http://serendipity-identity-service:8080;`** Forwards this traffic to the Identity Service.
- **`Large Buffer Settings:`** The proxy_buffer_size and proxy_buffers directives are explicitly increased. This is a
  common and necessary tweak, as authentication tokens (OAuth2/OIDC cookies and headers) are often too large for the
  default NGINX buffers and would otherwise cause HTTP 502 errors.
- **`Additional Headers:`** Explicitly forwards the server port and host to ensure the Identity Service generates
  correct token redirect URLs.

4. Database Administration Routing
- **`location /pgadmin`** captures all URLs starting with /pgadmin.

`docker-commpose.yml`:

```
  pgadmin:
    ...
    environment:
      PGADMIN_LISTEN_ADDRESS: "0.0.0.0"
      SCRIPT_NAME: "/pgadmin"
```

- **`proxy_pass http://pgadmin:80;`** Forwards this traffic to pgadmin running on port 80 inside a Docker network.
