# Rate Limiting

This document describes the rate limiting considerations for Serendipity — what is protected, where the limits are applied, and what to configure when you are ready to enforce them.

It is intended for administrators who run Serendipity in a networked environment, including local development with Docker Compose and any deployment behind a reverse proxy.

## What we protect against

Rate limiting is not a substitute for authentication, TLS, or input validation. It protects against a specific set of abusive patterns that those controls do not address:

- **Credential stuffing and brute force** — repeated authentication attempts against the login and OAuth 2.0 endpoints.
- **API abuse** — a single client sending an unreasonable volume of requests to the BFF or through it to backend services.
- **Data scraping** — automated enumeration of accounts, contacts, or other data through the PWA or any public API.
- **Volumetric abuse at the edge** — a flood of connections or requests that consumes nginx worker capacity before a request ever reaches the application.

The BFF is a confidential OAuth 2.0 client. Internal service-to-service calls that originate behind the BFF (for example, a request from the BFF to the Party Service) are trusted by design and are not the target of edge rate limits. Limits are applied to traffic that enters from outside the trusted boundary.

## Defence in depth

Rate limiting is layered. Each layer has a different scope and different information available to it.

### Edge — nginx

nginx terminates TLS and is the first component to see every incoming request. It has no session state and no knowledge of who the caller is — only the source IP (`$binary_remote_addr`). That makes it the correct place for coarse, IP-based limits: connection caps and general request-rate ceilings that apply before any request reaches the application.

The practical effect is that a client that opens too many connections or sends requests too fast is dropped at the edge without consuming BFF threads, backend connections, or database resources.

### BFF — per-session and per-endpoint limits

The BFF knows the caller's session and identity. Once a request is authenticated, limits can be applied per user rather than per IP. This is important for shared-NAT situations — a legitimate user behind the same IP as an abusive one should not be blocked because of the other user's behaviour.

The BFF is also the right place for endpoint-specific limits. For example, a contact search endpoint may warrant a different budget than a static asset request, and an authenticated user's read traffic should be treated differently from anonymous traffic.

### Identity Service — Keycloak brute-force detection

Keycloak has built-in brute-force detection. Failed login attempts, alternating usernames from the same IP, and other patterns are detected and can result in account or IP lockout. Serendipity relies on this for the authentication layer. The BFF does not duplicate Keycloak's brute-force protection — doing so would create two independent lockout policies that could conflict.

The division of responsibility is:

- **Keycloak** protects authentication: user enumeration, password guessing, and account-level abuse.
- **The BFF** protects the application: authenticated API usage, resource consumption, and abuse that Keycloak does not see.
- **nginx** protects the edge: connection floods, volumetric requests, and traffic that should never reach either service.

## nginx configuration

nginx rate limiting uses two primitives: **limit request zones** (frequency) and **limit connection zones** (concurrency). The zones are defined in the `http` context and applied in `server` or `location` blocks.

The configuration below is a starting point for the Serendipity nginx setup. It is not a complete `nginx.conf` — it shows the directives that should be added to the existing configuration. Adapt the rates, bursts, and zone sizes to your environment.

### Zone definitions

These belong in the `http` block, before the `server` blocks.

```nginx
# General request rate — every endpoint gets this baseline
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

# Stricter zone for authentication and API traffic
limit_req_zone $binary_remote_addr zone=auth:10m rate=3r/s;

# Connection concurrency — caps simultaneous connections per IP
limit_conn_zone $binary_remote_addr zone=conn:10m;
```

The `10m` size for each zone is a reasonable default for a moderate-traffic deployment. A 10m zone holds roughly 160,000 entries; adjust upward if you expect high connection counts and downward if memory is constrained.

### Applying limits in the Serendipity server block

The Serendipity nginx configuration has a `location ~ ^/(api|v2|login|oauth2|logout)/?` block that proxies to the BFF and a `location /` block that serves the PWA. Rate limits are applied to the API and authentication location and left unrestricted (or lightly restricted) on the static asset location.

```nginx
server {
  server_name serendipity.localhost;
  listen 443 ssl default_server;

  ssl_certificate     /etc/nginx/certs/serendipity.localhost-cert.pem;
  ssl_certificate_key /etc/nginx/certs/serendipity.localhost-key.pem;

  include /etc/nginx/conf/ssl.conf;

  # Default limit — applied to every location that does not override it
  limit_req zone=general burst=20 nodelay;
  limit_conn conn 20;

  # API and authentication traffic — stricter
  location ~ ^/(api|v2|login|oauth2|logout)/? {
      limit_req zone=auth burst=5 nodelay;
      limit_conn conn 10;

      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Host $host;

      proxy_pass http://serendipity-web-bff:8080;
      proxy_redirect off;
  }

  # Static assets and the PWA shell — lighter limits, large burst for page load
  location / {
      limit_req zone=general burst=40 nodelay;
      limit_conn conn 20;

      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Host $host;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      proxy_pass http://192.168.65.254:4200;
      proxy_redirect off;
  }

  # pgadmin — administrative, low volume, keep limits light
  location /pgadmin {
      limit_req zone=general burst=10 nodelay;
      limit_conn conn 5;

      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Host $host;

      proxy_pass http://pgadmin:80;
  }
}
```

### Understanding burst and nodelay

A rate limit without a burst is strict: any request that exceeds the rate is immediately rejected with `503 Service Unavailable`. A **burst** allows a queue of excess requests to be served during a short spike, which is what a normal page load looks like — the browser requests the HTML, the JS bundle, the CSS, and several API calls, all within a few hundred milliseconds.

- `burst=20` means up to 20 requests above the sustained rate (`10r/s`) can be queued.
- `nodelay` means those burst requests are served immediately rather than being delayed to spread them out. Without `nodelay`, a burst request is delayed until the rate allows it; with `nodelay`, it is served right away and counted against the burst budget.

For a human user on a modern connection, `burst=20 nodelay` on a `10r/s` zone is comfortable. For an abusive client that sustains requests above the rate for more than the burst window, the limit kicks in and subsequent requests receive `503`.

### The auth zone and the OAuth 2.0 flow

The `auth` zone (`rate=3r/s`, `burst=5`) is stricter than the general zone because authentication endpoints are the most abuse-prone. The value must be chosen carefully — it must be low enough to deter brute force but high enough not to interfere with a normal login.

A normal interactive login involves:

1. The browser navigates to the PWA.
2. The PWA initiates the OAuth 2.0 authorization request (a redirect to Keycloak).
3. The user authenticates at Keycloak.
4. Keycloak redirects back to the BFF's authorization code endpoint.
5. The BFF exchanges the code for tokens.

Each of these is a request or redirect. A burst of `5` at `3r/s` allows the sequence to complete without hitting the limit, provided the user is not repeatedly submitting credentials. Repeated failed logins — the pattern rate limiting is meant to stop — will exceed the burst quickly.

If you find legitimate logins are being rate-limited, increase the auth burst before increasing the rate. A burst of `10` at `3r/s` still limits sustained abuse but tolerates a slightly heavier authentication sequence.

### Custom error for rate-limited responses

By default nginx returns `503` when a rate limit is exceeded. Returning `429 Too Many Request` is more correct and more useful to clients. Add this inside the `http` block:

```nginx
limit_req_status 429;
limit_conn_status 429;
```

A `429` response should include a `Retry-After` header so a client that is being throttled knows when to try again. nginx does not add this header automatically — it can be added at the application layer (the BFF) or via an nginx `add_header` directive on a `error_page` handler. For the Serendipity setup, returning `429` from nginx and letting the BFF add `Retry-After` for its own responses is a reasonable split.

## BFF considerations

The BFF can enforce limits that nginx cannot, because it has session and user context. These are not configured in the current codebase and are noted here as future work.

### Per-user limits

Once a request is authenticated, the BFF knows the principal. A per-user limit — for example, a bucket of N requests per minute per authenticated user — protects against an individual abusing their session without affecting other users on the same IP.

This is preferable to per-IP limits for authenticated traffic because a shared NAT (office network, mobile carrier, public Wi-Fi) should not cause one user's behaviour to affect another's.

### BFF implementation approaches

Two libraries are worth considering for per-user and per-endpoint rate limiting in the BFF: Resilience4j and Bucket4j. Both implement the token bucket idea; the choice is about integration and operational fit, not about the underlying algorithm.

#### Resilience4j

Resilience4j provides a `RateLimiter` that is straightforward to use in a Spring Boot MVC filter or interceptor.

**Dependency:**

```xml
<dependency>
  <groupId>io.github.resilience4j</groupId>
  <artifactId>resilience4j-ratelimiter</artifactId>
</dependency>
```

For metrics, add `resilience4j-micrometer` and enable the `rateLimiter` metrics in the actuator.

**Configuration:**

A `RateLimiterConfig` defines the refill period and the number of permissions available in each period, plus how long a caller waits for permission:

```java
RateLimiterConfig config = RateLimiterConfig.custom()
  .limitRefreshPeriod(Duration.ofMinutes(1))
  .limitForPeriod(60)             // 60 requests per minute per bucket
  .timeoutDuration(Duration.ofMillis(500))
  .build();
```

**Per-user buckets:**

Create one `RateLimiter` per key and store it in a concurrent map. The key is the authenticated user ID when a session exists, and the remote address when the request is anonymous. Clean up stale buckets periodically.

```java
// Pseudo-code — not a complete implementation
ConcurrentHashMap<String, RateLimiter> limits = new ConcurrentHashMap<>();

String key = authenticatedUser != null
  ? authenticatedUser.getId()
  : request.getRemoteAddr();

RateLimiter limiter = limits.computeIfAbsent(key, k -> RateLimiter.of(k, config));

// In the filter or interceptor:
if (limiter.acquirePermission()) {
  chain.doFilter(request, response);
} else {
  response.setStatus(429);
  response.setHeader("Retry-After", "60");
}
```

For anonymous traffic, key by IP (`request.getRemoteAddr()`). For authenticated traffic, key by user ID from the security context. The same registry and config serve both — only the key differs.

**Metrics:**

Resilience4j emits Micrometer metrics for each `RateLimiter`, for example `resilience4j.ratelimiter.calls.allowed` and `resilience4j.ratelimiter.calls.rejected`. With Spring Boot Actuator and Prometheus, these appear at `/actuator/prometheus` and can be alerted on.

#### Bucket4j

Bucket4j is a standalone token-bucket library that is more explicit about refill strategies and supports distributed use cases.

**Dependency:**

```xml
<dependency>
  <groupId>com.github.vladimir-bukhtoyarov</groupId>
  <artifactId>bucket4j-core</artifactId>
  <version>8.10.0</version>
</dependency>
```

**Configuration:**

A `Bandwidth` defines the refill rate:

```java
Bandwidth limit = Bandwidth.simple(60, Duration.ofMinutes(1)); // 60 tokens per minute
Bucket bucket = Bucket.builder().addLimit(limit).build();
```

**Per-user buckets with Caffeine:**

Store buckets in a Caffeine cache keyed by user ID or IP. Caffeine handles eviction of stale entries.

```java
// Pseudo-code
Cache<String, Bucket> cache = Caffeine.newBuilder()
  .expireAfterAccess(Duration.ofMinutes(5))
  .build();

Bucket bucket = cache.get(key, k -> Bucket.builder()
  .addLimit(Bandwidth.simple(60, Duration.ofMinutes(1)))
  .build());

if (bucket.tryConsume(1)) {
  chain.doFilter(request, response);
} else {
  response.setStatus(429);
  response.setHeader("Retry-After", "60");
}
```

**Distributed deployments:**

For a clustered BFF, replace the in-memory cache with a distributed cache via `bucket4j-jcache` (JCache, Hazelcast, Ignite) or a Redis-backed token bucket. This is not required for the current single-deployment setup behind nginx, but it is the natural next step if the BFF is scaled horizontally.

#### Recommendation

For the Serendipity BFF — a Spring Boot MVC application behind a single nginx — **Resilience4j** is the better fit:

- It integrates with Spring Boot through `resilience4j-spring-boot-starter` and exposes Micrometer metrics to Actuator and Prometheus without extra wiring.
- The `RateLimiter` API is simple for a filter or interceptor use case.
- It is already in the Spring ecosystem, so it is familiar to developers maintaining the BFF.

Bucket4j is the better choice if you need explicit token-bucket semantics with custom refill strategies, or if you plan to distribute the rate limiter across multiple BFF instances via Redis. Neither requirement exists today.

Either library handles the core use case: per-user limits for authenticated traffic, per-IP limits for anonymous traffic, and a `429` response with a `Retry-After` header when the limit is exceeded. The nginx edge limits remain the first line of defence; the BFF limits are the second, and they are what make per-user enforcement possible.

### Anonymous vs authenticated traffic

Anonymous traffic (requests that have not completed the OAuth 2.0 login flow) should be treated as untrusted. The nginx edge limits apply to all traffic equally, which is correct for the anonymous case. Once the session is established, the BFF may relax the applicable limits for that session — not because the user is trusted absolutely, but because the authentication step has already gated access.

### Token and session endpoints

The OAuth 2.0 token endpoint and the session cookie endpoint deserve specific attention. The token exchange is a small, bounded number of calls per login — one per authorization code. A client that calls the token endpoint repeatedly without valid codes is either retrying incorrectly or probing. Either way, a limit here is reasonable.

The BFF's `/logout` endpoint is called once per session termination. It is unlikely to be abused directly, but it should not be left completely unguarded if the application is exposed beyond a trusted network.

## What Keycloak already covers

Keycloak's brute-force protection is enabled in the Serendipity deployment. Administrators should be aware of what it covers so they do not duplicate it:

- Failed login attempts are counted per user and per IP.
- Account lockout and/or IP bans can be configured in the realm's brute-force protection settings.
- The `events` log records failed logins and lockouts.

The Serendipity Keycloak client configuration documentation covers how to create the client and configure the BFF to use it. Brute-force protection settings are configured in the Keycloak Admin Console and are realm-specific. They are not documented in this project because they are a Keycloak configuration concern, not a Serendipity application concern.

The practical guidance for an administrator is: configure Keycloak's brute-force protection to your threat model, and do not add a redundant failed-login limit at the BFF for the same traffic.

## What these limits do not cover

Rate limiting at the nginx and BFF layers is not a complete defence against volumetric attacks:

- A distributed flood from many IPs is not stopped by per-IP limits. That requires upstream protection — a hosting provider's DDoS mitigation, a CDN with rate limiting, or a dedicated edge service.
- Slow-rate attacks (a client that sends requests just under the limit for a long time) consume resources at the application layer. They are mitigated by per-user limits and by resource isolation, not by the nginx edge limits alone.
- WebSocket and long-lived connection abuse is not addressed by the `limit_req` directives. A connection cap (`limit_conn`) helps, but a dedicated strategy for long-lived connections is future work.

These are infra-level concerns. For a local Docker Compose deployment behind a single nginx, the configuration above is sufficient. For any deployment exposed to the internet, an upstream edge (CDN or cloud load balancer) should apply its own rate limiting before traffic reaches the Serendipity nginx.

## Monitoring

Rate limiting is only useful if you know when it is being triggered. The two signals to watch are:

- **nginx access log** — requests that return `429` are rate-limited. Counting these over time tells you whether limits are being hit by legitimate traffic (a sign the limits are too low) or by abuse (a sign they are working).
- **Application logs** — if the BFF returns `429` for its own enforced limits, those should be logged with enough context (endpoint, user if authenticated, source IP) to distinguish abuse from a misconfigured client.

For a local deployment, a periodic check of the nginx access log for `429` status codes is sufficient. For any deployment with meaningful traffic, forward the logs to a place where `429` counts can be trended and alerted on.

## Getting started

When you are ready to enable rate limiting:

1. Add the `limit_req_zone` and `limit_conn_zone` directives to the `http` block of your nginx configuration.
2. Add `limit_req`, `limit_conn`, and `limit_req_status 429` to the relevant `server` and `location` blocks.
3. Start with the values in this document.
4. Watch the nginx access log for `429` responses during normal use.
5. Adjust the general zone burst upward if legitimate page loads are being rate-limited.
6. Leave the auth zone strict until you have confirmed that normal logins are not affected.

The values in this document are starting points, not a security guarantee. Tune them to your traffic and your threat model.

## References

- nginx documentation: [Rate Limiting](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- nginx documentation: [Connection Limiting](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)
- Keycloak documentation: [Brute Force Detection](https://www.keycloak.org/docs/latest/server_admin/#_brute_force_detection)
- OWASP: [Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Rate_Limiting_Cheat_Sheet.html)
