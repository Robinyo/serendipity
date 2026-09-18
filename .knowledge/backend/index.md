# Serendipity — Backend Architecture

**Last updated:** 2026-09-16

This document describes the Serendipity backend architecture: the build layout,
the modules, the runtime topology, and how the pieces fit together. It is part of
the `.knowledge/` layer and is the canonical backend-architecture reference — the
Docusaurus docs at `website/docs/` refine it with component-level detail (BFF,
Party Service, Keycloak), and `backend/security.md` covers the security model
specifically.

## Build layout

The backend is a **Maven multi-module project** rooted at `backend/`. The parent
is `serendipity-parent` (packaging `pom`), inheriting from
`spring-boot-starter-parent` v4.0.1. Java 25, Spring Cloud 2025.1.0.

**Modules** (declared in the parent POM's `<modules>`):

| Module | Path | Role |
|---|---|---|
| `web-bff` | `backend/modules/web-bff/` | Backend for Frontend — the OAuth 2.0 confidential client, session manager, and gateway in front of the services |
| `party-service` | `backend/modules/party-service/` | Customer-engagement domain service — parties, names, addresses, roles, electoral divisions |

The parent POM also declares a `<dependencyManagement>` section (ArchUnit,
Spring Boot starters, Lombok, MapStruct) and the standard build plugins
(`maven-dependency-plugin`, `maven-surefire-plugin`, `maven-compiler-plugin` with
Lombok + MapStruct annotation processors, `spring-boot-maven-plugin`). The
compiler plugin configures MapStruct's default component model as `spring`.

**Profiles** (parent POM): `dev` (active by default), `test`, `prod`. Each sets
`spring.profiles.active`. The `web-bff` module adds its own `prod` profile that
switches the frontend-copy phase on (copies the built Angular PWA into
`target/classes/static/`) — so a prod build embeds the frontend in the BFF jar.

## The modules

### web-bff

`backend/modules/web-bff/` — the **Backend for Frontend**. It is the only module
that has Spring Security and OAuth 2.0 client support.

Key dependencies (from `pom.xml`):

- `spring-boot-starter-oauth2-client` — confidential client OIDC flow, token
  exchange with Keycloak
- `spring-boot-starter-security` — session-based auth, CSRF protection, the
  security configuration
- `spring-cloud-starter-gateway-server-webmvc` — Spring Cloud Gateway (WebMVC
  flavor), used as the routing/gateway layer in front of the backend services
- `httpclient5` — HTTP client for forwarding calls to backend services

Build behavior: the `maven-resources-plugin` copy-resources execution (phase
controlled by `frontend-copy.phase`, defaulting to `none`) copies the built Angular
PWA from `frontend/dist/serendipity-pwa/browser` into `target/classes/static/`.
The `prod` profile switches that phase to `validate`, so a production build embeds
the frontend into the BFF jar. The BFF thus serves both the API and (in prod) the
frontend from one artifact.

### party-service

`backend/modules/party-service/` — the **customer-engagement domain service**. It
is the Party Service: parties, names, addresses, roles, electoral divisions, and
the links between them.

Key dependencies (from `pom.xml`):

- `spring-boot-starter-data-jpa` — JPA / Hibernate, the entity model and
  repositories
- `spring-boot-starter-data-rest` — exposes the repository model as a REST
  repository endpoint
- `spring-boot-starter-json` — JSON serialization
- `spring-boot-starter-validation` — Bean Validation on DTOs (e.g.
  `NameUpdateDto`, `OrganisationUpdateDto` with `@NotBlank`)
- `postgresql` (runtime) — PostgreSQL driver
- `h2` (test) — in-memory database for tests
- `archunit-junit5` (test) — architecture tests (`ArchitectureTests`)

**Notable:** the Party Service has **no `spring-boot-starter-security`** and no
`SecurityConfig` in its `pom.xml` or source tree. It does **not** configure itself
as an OAuth 2.0 resource server. This is the substance of [ADR-0004](./log.md#
adr-0004) and [ADR-0005](./log.md#adr-0005): the Party Service trusts the BFF as
its security boundary as shipped, and resource-server support is an open roadmap
item (🔄).

**Package layout** (from the source tree):

- `entity/` — JPA entities: `Party`, `Organisation`, `Individual`, `IndividualName`,
  `Name`, `Location`, `Address`, `ElectoralDivision`, `Identifier`, `Role`,
  `Auditable`
- `type/` — enums: `PartyType`, `LocationType`
- `repository/` — Spring Data repositories: `PartyRepository`,
  `IndividualRepository`, `OrganisationRepository`, `IndividualNameRepository`
- `service/` — service layer: `IndividualService`, `OrganisationService`
- `model/` — projection models: `PartyModel`, `IndividualModel`,
  `OrganisationModel`, `NameModel`
- `dto/` — update DTOs: `NameUpdateDto`, `OrganisationUpdateDto`, `AddressUpdateDto`,
  `IndividualUpdateDto`, `RoleUpdateDto`
- `controller/` — REST controllers: `Controller` (the main party controller),
  `AccountController`, `ContactController`, `AddressController`,
  `ElectoralDivisionController`, `IndividualController`,
  `IndividualNameController`, `OrganisationController`, `PartyController`,
  `RoleController`
- `assembler/` — resource assemblers: `PartyAssembler`, `IndividualAssembler`,
  `OrganisationAssembler`, `AddressAssembler`, `ElectoralDivisionAssembler`,
  `IndividualNameAssembler`, `IndividualSummaryAssembler`,
  `OrganisationSummaryAssembler`, `RoleAssembler`
- `mapper/` — MapStruct mappers: `IndividualMapper`, `OrganisationMapper`
- `exception/` — `GlobalExceptionHandler` (RFC 7807 ProblemDetail), `ResourceNotFoundException`
- `database/seed/au/` — Australian political-domain seed data (political parties,
  electoral divisions, Parliament House, etc.)

Soft delete: `Party` carries `toDate`, with a
`@SQLRestriction("to_date IS NULL or to_date > CURRENT_DATE")` filter. Subtypes
(`Organisation`, `Individual`) do not repeat the soft-delete field — only `Party`
(the root) has it. See [ADR-0002](./log.md#adr-0002) and `backend/security.md`.

## Runtime topology

The backend runs in **Docker Compose** (`backend/docker-compose.yml`), on a
shared `serendipity` network. The composition:

| Service (container) | What it is | Notes |
|---|---|---|
| `nginx` | Reverse proxy / TLS termination | Binds 127.0.0.1:80 and :443; depends on identity-service and web-bff; serves SSL config from `services/nginx/conf/` |
| `serendipity-identity-service` | **Keycloak** (quay.io/keycloak/keycloak) | `start-dev --import-realm`; PostgreSQL-backed (`identity-service-data`); imports a realm from `services/identity-service/import/`; exports to `services/identity-service/export/` |
| `identity-service-data` | PostgreSQL for Keycloak | `SERENDIPITY_IDENTITY_SERVICE_*` credentials from `.env` |
| `serendipity-storage-service` | PostgreSQL for the domain services | `SERENDIPITY_STORAGE_SERVICE_*` credentials from `.env` |
| `serendipity-party-service` | Party Service (built from `modules/party-service/Dockerfile`) | Port 30101 → 8080; wired to `serendipity-storage-service`; healthcheck on `/actuator/health` |
| `serendipity-web-bff` | BFF (built from `modules/web-bff/Dockerfile`) | Trusts `serendipity-party-service`; references `WORKFLOW_SERVICE_URI` (Camunda orchestration) and `PARTY_SERVICE_URI`; healthcheck on `/actuator/health/readiness`; mounts certs for the truststore |
| `pgadmin` | pgAdmin4 | Connected to both Postgres instances; for admin/debugging |

Environment is driven by a `.env` file at the repo root (consumed via `env_file`
in compose and by the build). Secrets (client secrets, DB passwords, admin
credentials, truststore password) live in `.env` and are **not** committed to the
repo — represented as `[REDACTED]` in any knowledge-layer summary.

**Not in compose (referenced but not running as containers here):** Camunda 8.9
orchestration — the BFF's `WORKFLOW_SERVICE_URI` points at `http://orchestration:
8080/v2/user-tasks`, but the orchestration service is not a container in this
compose file (commented-out network references: `camunda-platform`,
`identity-network`, `web-modeler`). The live platform includes Camunda; the local
docker-compose snapshots the services that run locally.

## How the pieces fit together

```
Angular PWA  ──►  nginx (TLS, reverse proxy)  ──►  serendipity-web-bff  ──►  serendipity-party-service  ──►  serendipity-storage-service (PostgreSQL)
                                                           │                      ▲
                                                           ▼                      │
                                                    serendipity-identity-service (Keycloak + PostgreSQL)
                                                           │
                                                     identity-service-data
```

- The PWA talks to `nginx`, which routes to the BFF (and terminates TLS).
- The BFF authenticates the user against Keycloak (OIDC), maintains the session,
  and forwards the access token to the Party Service (and, via
  `WORKFLOW_SERVICE_URI`, to Camunda) on the user's behalf.
- The Party Service persists to `serendipity-storage-service` (PostgreSQL).
- Keycloak persists to `identity-service-data` (a separate PostgreSQL).
- pgAdmin connects to both databases for admin access.

The BFF is the **security boundary** between the browser and the services. The
Party Service, as shipped, trusts the BFF and does not enforce its own
resource-server checks (ADR-0004) — that is the open work tracked on the roadmap.

## Build and run

**Local dev (compose):** `docker-compose up` (or the equivalent `docker compose`
invocation) from `backend/`, with a `.env` file present. Keycloak starts in
`start-dev` mode with realm import; the Party Service and BFF build from their
Dockerfiles. The BFF's `dev` profile (active by default) skips the frontend copy.

**Building the JARs:** `mvn package` (or the IDE's Maven runner) from `backend/`.
The parent POM drives both modules. A `prod` build of the BFF embeds the frontend.

**Architecture tests:** the Party Service's `ArchitectureTests` (ArchUnit) enforce
structural rules on the party-service code — part of the module's test suite.

## Known gaps and open items

- **Party Service as an OAuth 2.0 resource server (🔄)** — the Party Service has no
  `spring-boot-starter-security` and no `SecurityConfig`; it trusts the BFF. Adding
  resource-server support is the open work that closes the gap between ADR-0001's
  stated design and the current implementation. Tracked on the roadmap.
- **`backend/services/` tree** — the repository has `backend/services/camunda`,
  `backend/services/identity-service`, `backend/services/nginx`, and
  `backend/services/pgadmin` directories, which hold the compose-level service
  configuration (nginx conf, Keycloak realm import/export, etc.). These are the
  runtime/service-configuration counterpart to the Java modules. Not every
  directory is fully populated in the local snapshot — the identity-service import/
  export paths and nginx conf are the ones used by compose.
- **Additional backend services** — as the project grows beyond the BFF and
  Party Service, additional modules would be added to the parent POM's `<modules>`
  and to the compose topology. The build layout is extensible by adding a module.

## Related documents

- [ADR-0001](./log.md#adr-0001) — BFF as OAuth 2.0 confidential client
- [ADR-0002](./log.md#adr-0002) — soft delete for Party entities
- [ADR-0003](./log.md#adr-0003) — BFF CORS, CSRF, session security
- [ADR-0004](./log.md#adr-0004) — Party Service trusts BFF as security boundary
- [ADR-0005](./log.md#adr-0005) — Party Service entity model is the source of truth
- [Backend — Security](./backend/security.md) — the security model (two-token model,
  roles, groups, `manager` attribute, enforcement)
- [Frontend — Architecture](./frontend/index.md) — the frontend and its relationship
  to the BFF
- [Party Service component overview](https://robinyo.github.io/serendipity/docs/
  components/party-service/overview/) — Party Service component documentation (Docusaurus)
- [BFF component overview](https://robinyo.github.io/serendipity/docs/components/
  bff/overview/) — BFF component documentation (Docusaurus)
- [Roadmap](https://robinyo.github.io/serendipity/docs/roadmap/) — the 🔄
  resource-server item and other backend work
