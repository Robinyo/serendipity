# Configuration

NGINX sets up a secure reverse proxy for local development and testing. It handles HTTP-to-HTTPS redirection, 
SSL termination, and reverse proxy routing for backend services.

`nginx-default.conf.template`:

```
server {

  server_name serendipity.localhost;
  listen 80;

  return 301 https://$host$request_uri;

}

server {

  server_name serendipity.localhost;
  listen 443 ssl default_server;
  include /etc/nginx/conf/ssl.conf;

  # Backend For Frontend (BFF) Routing
  location / {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $host;

      proxy_pass http://serendipity-web-bff:8080;
      proxy_redirect off;
  }

  # Identity Service (Keycloak) Routing
  location /auth/ {
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

  # Database Administration Routing
  location /pgadmin {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host $host;
      proxy_set_header X-Forwarded-Port $server_port;
      proxy_set_header Host $host;

      proxy_pass http://pgadmin:80;
  }

}
```

1. HTTP to HTTPS Redirection (First Block)
- **`listen 80;`** listens for unsecured HTTP traffic on port 80.
- **`server_name serendipity.localhost;`** restricts this block to requests matching this local hostname.
- **`return 301 https://$host$request_uri;`** issues a permanent redirect (301) to force the browser or client to 
  reconnect securely over HTTPS, preserving the hostname and exact URL path.

2. HTTPS Server & SSL Termination (Second Block)
- **`listen 443 ssl default_server;`** handles secure HTTPS traffic on port 443. It is designated as the default server 
  block for any unmatched HTTPS traffic on this IP.
- **`include /etc/nginx/conf/ssl.conf;`** imports an external file containing the SSL certificates and cryptographic 
  settings (like protocols and ciphers) to perform SSL termination.

3. Backend For Frontend (BFF) Routing
- **`location /`** acts as the catch-all route for any traffic not matching the other explicit paths.
- **`proxy_pass http://serendipity-web-bff:8080;`** forwards this traffic to the BFF running on port 8080 inside 
  a Docker network.
- **`Headers:`** Forwards client details (IP, protocol) and keeps the original request Host header intact.
- **`proxy_redirect off;`** prevents NGINX from modifying the Location headers in responses sent by the backend.

4. Identity Service (Keycloak) Routing
- **`location /auth/`** captures all URLs starting with /auth/.
- **`proxy_pass http://serendipity-identity-service:8080;`** forwards this traffic to the Identity Service.
- **`Large Buffer Settings:`** The proxy_buffer_size and proxy_buffers directives are explicitly increased. This is a 
  common and necessary tweak, as authentication tokens (OAuth2/OIDC cookies and headers) are often too large for the 
  default NGINX buffers and would otherwise cause HTTP 502 errors.
- **`Additional Headers:`** Explicitly forwards the server port and host to ensure the Identity Service generates 
  correct token redirect URLs.

5. Database Administration Routing
- **`location /pgadmin`** captures all URLs starting with /pgadmin.

`docker-commpose.yml`:
  
```
  pgadmin:
    ...
    environment:
      PGADMIN_LISTEN_ADDRESS: "0.0.0.0"
      SCRIPT_NAME: "/pgadmin"
```

- **`proxy_pass http://pgadmin:80;`** forwards this traffic to pgadmin running on port 80 inside a Docker network.
