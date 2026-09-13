# Design Document

## Purpose

This document describes Serendipity's approach to observability — how the platform makes its running services understandable through logs, metrics, and traces. It is a design document, not an implementation plan. It captures the architecture, the chosen instrumentation approach, and the decisions behind it. The implementation is tracked separately in the [Roadmap](../../website/docs/roadmap.md) (Phase 2 — Observability).

Observability is out of scope for now in terms of implementation. This document exists so that when the work is picked up, the approach is already decided and the implementation follows a coherent plan rather than a collection of ad-hoc additions.

## Target services

Observability applies to all Spring Boot-based services in Serendipity. At the time of writing, the relevant services are:

- **Web BFF** (`backend/modules/web-bff/`) — the OAuth 2.0 confidential client, the gateway between the Angular PWA and the backend services, the primary HTTP entry point.
- **Party Service** (`backend/modules/party-service/`) — the customer-engagement domain service (individuals, organisations, accounts, contacts).
- **Any future Spring Boot service** added to the platform — the approach should be reusable, not specific to the BFF or Party Service.

The Angular PWA is a client — it generates its own browser-side telemetry (e.g. JavaScript error tracking, client-side route analytics) but that is a separate concern from the server-side observability described here. The PWA's server-side interactions are observable through the BFF and the backend services.

Camunda and other non-Spring Boot components have their own observability surfaces (Camunda's own metrics, logs, and traces). Those are out of scope for this document — they would be addressed separately if and when Camunda observability is in scope.

## Guiding principles

### Single instrumentation point, multiple outputs

The primary principle is that we instrument once and emit everywhere. Spring Boot's Micrometer Observation API (`ObservationRegistry`) is the mechanism: a single instrumentation point produces both a Timer metric (for Prometheus) and a distributed trace span (for OTLP/tracing backends). We do not maintain separate instrumentation for metrics and for traces — that leads to drift, double work, and inconsistent naming.

This principle favors the Observation API over decorating methods with separate metric and trace code. When we annotate a route-handling method or a proxy-logic method with `@Observed`, we get latency metrics and a trace span from the same annotation. We do not write a Timer manually and then separately start a span.

### OTLP as the export standard

We standardize on OpenTelemetry Protocol (OTLP) as the export format for metrics and traces. OTLP is vendor-neutral: the same instrumentation produces data that can be consumed by Grafana Cloud, Honeycomb, Elastic, Prometheus + Tempo, or any other OTLP-compatible backend. We do not target a specific vendor's format.

For auto-instrumentation of Spring MVC, JDBC, and downstream HTTP calls, we lean toward the OpenTelemetry Java Agent (zero-code, attaches at JVM startup). It instruments the framework layer without changes to application code. For finer control where we need it (e.g. custom business-method spans, custom metric tags), we use the Spring Boot OpenTelemetry starter or Micrometer's Observation API directly. The agent and the SDK are complementary, not alternatives — we can use the agent for framework auto-instrumentation and the SDK/Observation API for application-level instrumentation.

### Logs, metrics, and traces share an identity

The three pillars — logs, metrics, traces — are most useful when they share a trace identity. A request produces a trace (span tree), the trace's `traceId` is propagated into every structured log line for that request via MDC (Mapped Diagnostic Context), and metrics produced for that request carry the same identity through exemplars so that a metric spike in Grafana can be linked directly to the relevant trace.

This correlation is not optional — without it, the three pillars are independent signals that are hard to relate. With it, an operator can go from a latency spike in a metric → the traces that contributed to it → the log lines for a specific trace → the exact request.

### Low cardinality in metrics, high cardinality in traces and logs

Metric tags must be low-cardinality. Values like `http.method` (`GET`, `POST`), `http.status_code` (`200`, `404`, `500`), `http.route` (`/api/party-service/parties`), and `outcome` (`SUCCESS`, `SERVER_ERROR`) are appropriate metric tags — they have a small, bounded set of values and produce useful groupings.

Values like `user.id`, `party.publicId`, `account.id`, or any other entity identifier are high-cardinality — they have unbounded, large value spaces. These belong in trace span attributes and in log fields (structured JSON), not in metric tags. A metric with `user.id` as a tag would create a separate time series for every user, which is not scaleable.

The Observation API helps here: it produces metrics with the low-cardinality tags we configure and trace spans with the high-cardinality attributes we attach. We are deliberate about which values go where.

### Actuator is a management surface, not a public API

Spring Boot Actuator exposes operational endpoints (`/actuator/...`). These are management endpoints, not business APIs. They should be treated as a management surface — protected, scoped, and not broadly exposed.

The current BFF `application.yml` exposes `beans, env, health, info, metrics` via `management.endpoints.web.exposure.include`. This is too broad for anything beyond local development — `beans` and `env` leak configuration and are not appropriate to expose on a deployed service. For non-local deployments, the include list should be restricted to `health, info, metrics, prometheus` (and `prometheus` only when the Prometheus scrape is needed).

For deployments where the management endpoints need to be isolated from the application's main HTTP port, `management.server.port` can move the Actuator to a separate port that is not exposed to the public network. Alternatively, sensitive endpoints can be protected with Spring Security. The choice depends on the deployment environment — both are valid.

## Architecture

### Instrumentation layer

The observability instrumentation sits in the application, alongside the business logic, but is not the business logic. It is the layer that observes the application's behavior and emits signals.

```
┌──────────────────────────────────────────────────────────────────┐
│                     Spring Boot application                      │
│                                                                  │
│  ┌───────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Controller        │  │   Service    │  │    Repository     │  │
│  │ / @RequestMapping │  │  (business   │  │   (data access)   │  │
│  │ / filter          │  │   logic)     │  │                   │  │
│  └─────────┬─────────┘  └──────┬───────┘  └────────┬──────────┘  │
│            │                   │                   │             │
│            ▼                   ▼                   ▼             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Observation API (instrument once)             │  │
│  │     @Observed  /  ObservationRegistry  /  auto span        │  │      
│  └─────────────────────────────┬──────────────────────────────┘  │
│                                │                                 │
│                 ┌──────────────┴──────────────┐                  │
│                 ▼                             ▼                  │
│           ┌──────────────┐            ┌───────────────┐          │
│           │  Micrometer  │            │ OpenTelemetry │          │
│           │    Timer     │            │     Span      │          │
│           │  (metrics)   │            │   (traces)    │          │
│           └──────┬───────┘            └──────┬────────┘          │
│                  │                           │                   │
│                  ▼                           ▼                   │
│           ┌──────────────┐            ┌──────────────┐           │
│           │ Prometheus   │            │  OTLP export │           │
│           │  scrape      │            │  (Collector) │           │
│           └──────────────┘            └──────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

- **Framework auto-instrumentation** — the OpenTelemetry Java Agent instruments Spring MVC request handling, JDBC calls, and outgoing HTTP client calls without application code changes. This gives us request latency, database query latency, and downstream call latency automatically.
- **Application-level instrumentation** — where we need it (e.g. business-method execution time, custom metric tags, custom span attributes), we use the Observation API directly or `@Observed` annotations. We keep this minimal — only for the things that matter and that the auto-instrumentation doesn't cover.
- **Structured logging** — Logback is configured to emit JSON. The MDC is populated with `traceId` and `spanId` from the active observation/trace, so every log line for a request carries the trace identity. Log lines also carry the standard fields: `timestamp`, `level`, `logger`, `message`, `thread`, and any context we explicitly add.

### Export and collection

```
Service                        Collector                        Backend
────────                        ────────                        ──────
├── Micrometer ──► Prometheus scrape ──►  Prometheus (TSDB)
│   Timer
├── OTLP spans ──► OTLP exporter ──► OTEL Collector ──► Tempo / Grafana / Honeycomb
│   (traces)
└── JSON logs ──► stdout / file ──►  Fluent Bit / Promtail ──► Loki / Elastic / CloudWatch

```

- **Metrics** are scraped by Prometheus from `/actuator/prometheus`. The BFF and each service expose a Prometheus scrape endpoint; Prometheus pulls from it. Metrics are stored in a Prometheus time-series database.
- **Traces** are exported via OTLP to an OTEL Collector (or directly to a tracing backend that accepts OTLP). The Collector can then forward to Tempo, Grafana Cloud, Honeycomb, or any OTLP-compatible backend.
- **Logs** are emitted as structured JSON to stdout (or a file). A log collector (Fluent Bit, Promtail, or the environment's log shipper) ingests them into Loki, Elastic, CloudWatch, or the environment's log store.

This is the intended architecture. The exact backends (Prometheus + Tempo? Grafana Cloud? self-hosted? cloud SaaS?) are a deployment decision, not a design decision — the instrumentation and export are OTLP and Prometheus-native, so they are portable.

### Security model

Observability data is operational data, not business data, but it can still be sensitive. Trace IDs, log messages, and metric labels can reveal information about the running system. The observability stack must be secured like any other management surface:

- Actuator endpoints are restricted (see above).
- The OTLP exporter and the log collector should authenticate to the backend — OTLP supports authentication headers.
- Traces and logs should not be exposed to unauthorized parties. The observability backend's access control is part of the deployment's security posture.

Observability data should not contain sensitive business data (customer PII, tokens, secrets) in spans, log messages, or metric labels. The instrumentation should be reviewed to ensure it does not capture secrets or sensitive fields in span attributes or log messages.

## Chosen approaches

### Micrometer Observation API for instrumentation

We use Spring Boot's Micrometer Observation API as the primary instrumentation mechanism. It is the unified API for metrics and traces in Spring Boot, and it integrates with the OTLP export and the structured logging MDC.

- `@Observed` on key business methods and route-handling logic — produces a Timer metric and a trace span from a single annotation.
- `ObservationRegistry` directly where we need more control than `@Observed` provides (e.g. custom tags, conditional observation).
- We avoid decorating lightweight utility methods — observation is for significant operations (a request, a service call, a repository query), not for every method in the codebase. This keeps trace volume manageable and avoids noise.

### OpenTelemetry (OTLP) for export

We standardize on OTLP for exporting metrics and traces. The OpenTelemetry Java Agent provides zero-code auto-instrumentation of Spring MVC, JDBC, and downstream HTTP calls. Where we need programmatic control, Spring Boot's OpenTelemetry starter is used.

We do not commit to a specific tracing backend in this design — OTLP is portable. The deployment chooses the backend (Grafana Cloud, Honeycomb, Elastic, self-hosted Tempo + Mimir, etc.).

### Structured JSON logging

Logs are emitted as structured JSON. The implementation uses Logback with a JSON encoder (`logstash-logback-encoder` or Logback's built-in `JsonEncoder`). Every log line includes:

- `timestamp` — ISO-8601 with milliseconds.
- `level` — `INFO`, `WARN`, `ERROR`, etc.
- `logger` — the logger name.
- `message` — the log message.
- `thread` — the thread name.
- `traceId`, `spanId` — from the MDC, populated by the Observation API / OTel when tracing is active.
- Any additional context the application explicitly puts in the MDC (e.g. `user.id` when a user is authenticated, `party.id` for a party operation) — deliberately limited to values that aid debugging, not high-cardinality metric tags.

The default console logging (plain text) is replaced by JSON when the observability work is implemented. During local development, plain-text logging may be retained for readability, but the production configuration is JSON.

### Externally controlled log levels

Log levels are controlled externally at runtime, not by re-deploying. Spring Boot Actuator's `/actuator/loggers` endpoint (when exposed) lets an operator change the log level of a specific logger without restarting the service. This is useful for debugging in production — e.g. temporarily raise `org.springframework.web` or a specific service package to `DEBUG` to investigate a problem, then lower it back.

This is a feature of the Actuator, not an additional dependency. It is enabled when Actuator is on the classpath and the loggers endpoint is exposed. In production, the loggers endpoint should be protected (it is part of Actuator, so the same Actuator security rules apply).

## What we instrument now (current state)

The current BFF `application.yml` already includes:

- `spring-boot-starter-actuator` on the classpath (via the parent POM) — Actuator is present.
- `management.endpoints.web.exposure.include=beans,env,health,info,metrics` — endpoints exposed.
- `management.endpoint.health.probes.enabled=true` — Kubernetes liveness/readiness probes enabled.
- `management.endpoint.health.show-details=always` — health endpoint shows details (useful for local debugging; may be tightened in production).
- Logging levels configured for `root`, `org.springframework.cloud.gateway.server.mvc`, `org.springframework.security`, `org.springframework.web`.

What the current state does **not** include:

- `prometheus` in the endpoint include list — `/actuator/prometheus` is not exposed.
- The OpenTelemetry Java Agent or Spring Boot OTel starter — no OTLP export, no auto-instrumentation.
- Structured JSON logging — logs are plain text (console appender, default Logback configuration).
- The Micrometer Observation API in use — no `@Observed` annotations, no custom `Observation` usage.
- MDC propagation of `traceId`/`spanId` — no tracing, so no trace context in logs.
- Exemplars — no exemplars, because there is no OTLP tracing connected to the metrics.

All of these are implementation items, tracked in the Roadmap.

## Implementation approach

The implementation follows the guiding principles above. The order is not prescribed, but a sensible sequence is:

1. **Restructure the Actuator exposure** — restrict `management.endpoints.web.exposure.include` to `health,info,metrics,prometheus` (drop `beans` and `env), tighten `health.show-details` for production, and decide on `management.server.port` or Spring Security protection for the management endpoints. This is a security improvement that should happen first or early — the current exposure is too broad for any non-local deployment.

2. **Add Prometheus to the include list and expose `/actuator/prometheus`** — enables Prometheus scraping. The Micrometer `metrics` endpoint is already included; adding `prometheus` gives Prometheus a scrapeable format.

3. **Add structured JSON logging** — introduce a JSON encoder in Logback. This is a configuration change; it does not require application code changes. The MDC fields (`traceId`, `spanId`) will only be populated once tracing is wired, but the JSON structure is in place from the start.

4. **Add OTLP tracing** — introduce the OpenTelemetry Java Agent (or Spring Boot OTel starter) and configure OTLP export. This gives us auto-instrumented traces (Spring MVC, JDBC, HTTP client) and the `traceId`/`spanId` in the MDC for log correlation.

5. **Instrument with the Observation API** — add `@Observed` to key route-handling and proxy-logic methods in the BFF, and to significant service methods in the Party Service (and any future service). This produces Timer metrics and trace spans from a single instrumentation point. Custom tags are low-cardinality (`http.method`, `http.status_code`, `outcome`); high-cardinality values (entity IDs) are span attributes or log fields, not metric tags.

6. **Enable exemplars** — when Prometheus and OTLP tracing are both connected, enable exemplars on the Micrometer Timer so that a metric spike in Grafana can be linked to the relevant trace.

The implementation is tracked in the Roadmap under Phase 2 — Observability, with exit criteria that confirm the deployed service exposes the expected endpoints and emits the expected signals.

## What is out of scope

- **Client-side (Angular PWA) observability** — JavaScript error tracking, client-side performance monitoring, and client-side analytics are separate concerns. They may use a different toolchain (e.g. Sentry, Google Analytics, or a custom solution) and are not covered by this document.
- **Camunda and non-Spring Boot component observability** — Camunda has its own metrics and logs. Those are addressed separately if and when Camunda observability is in scope.
- **Alerting and dashboards** — this document covers instrumentation and signal production. The alerting rules, dashboards, and SLOs that consume these signals are operational concerns, defined separately (e.g. in the deployment environment's monitoring configuration).
- **Specific tracing backend or SaaS** — OTLP is portable; the backend is a deployment decision. This document does not choose between Grafana Cloud, Honeycomb, Elastic, self-hosted Tempo, or any other backend.
- **Distributed tracing across the full stack from day one** — we start with the BFF and the Party Service. Full-stack tracing (including downstream services, Camunda, the database, external APIs) is an incremental goal, not an initial requirement.

## Relationship to the roadmap

The Roadmap tracks the implementation work under Phase 2 — Observability. The roadmap items are:

- Actuator health endpoints — confirm probes, expose `/actuator/info`.
- Structured JSON logging — replace console logging with JSON.
- Basic metrics via Micrometer and Prometheus — add `prometheus` to the include list, instrument with the Observation API, enable exemplars.

The design document is complementary — it captures the architecture and the chosen approaches, so the implementation follows a coherent plan. The roadmap items are the implementation tasks; this document is the design behind them.

The Observability best practices from the roadmap (Micrometer Observation API, OTLP standardization, three-pillar correlation, cardinality management, Actuator security) are the guiding principles for the implementation. They are not separate tasks — they are the approach that the implementation follows.

## Open questions

These are decisions that implementation must resolve, not assumptions this document makes:

1. **Which OTLP backend?** Grafana Cloud, Honeycomb, Elastic, self-hosted Tempo + Mimir, or another? The instrumentation is OTLP-native, so the choice is a deployment decision, not a design decision. The implementation should be configurable so the backend can be chosen without code changes.

2. **Java Agent vs. SDK for auto-instrumentation?** The OpenTelemetry Java Agent provides zero-code auto-instrumentation; the Spring Boot OTel starter provides programmatic control. We may use both — the agent for framework auto-instrumentation and the SDK for application-level control. The decision is a trade-off between simplicity (agent) and control (SDK), and may depend on which we prefer to operate.

3. **Self-hosted or managed observability backend?** Prometheus + Tempo self-hosted, or a managed SaaS? This is a deployment and cost decision, not a design decision. The instrumentation and export are the same either way.

4. **Log collector and log backend?** Fluent Bit, Promtail, the environment's existing log shipper, or another? The logs are JSON on stdout; the collector and backend are a deployment decision.

5. **Which services get observability first?** The BFF and Party Service are the natural starting points. Other services (future Spring Boot services, Camunda) follow when they are in scope. The approach is reusable across all Spring Boot services.

