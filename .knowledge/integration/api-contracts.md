# Serendipity — API Contracts

**Last updated:** 2026-09-16

This document is the canonical record for API contracts across Serendipity —
the REST endpoints the frontend and backend services expose, the request/response
shapes, and the error contract. It is part of the `.knowledge/` layer.

**Status: placeholder.** A fuller contract layer (OpenAPI specs, generated client
types, contract tests) is a roadmap item (🔄). This document captures what is
known today and what the target state is, so the knowledge layer is not silent on
the topic while the work is open.

## Current surface — what exists today

### Party Service REST API

The Party Service exposes a REST API under `backend/modules/party-service/`.
Primary sources:

- **Controller:** `backend/modules/party-service/src/main/java/org/serendipity/
  party/controller/Controller.java` — the REST controller mapping HTTP requests
  to service calls.
- **Services:** `IndividualService`, `OrganisationService` — the service layer.
- **DTOs:** `NameUpdateDto`, `OrganisationUpdateDto` — the request shapes for
  updates (e.g. `NameUpdateDto` carries `@NotBlank` on `givenName` and
  `familyName`; `OrganisationUpdateDto` carries `@NotBlank` on `name`).

The Party Service's API surface covers individuals, organisations, names, and the
links between them. (The full endpoint inventory is to be captured here — survey
the Controller and service layer when the contract layer is written.)

**Error contract:** The Party Service returns errors as **RFC 7807 ProblemDetail**
(`application/problem+json`). The `GlobalExceptionHandler` in the Party Service
converts validation failures and other exceptions into ProblemDetail responses.
This is the error contract the frontend and any API consumer can rely on.

See the Party Service component overview at
`https://robinyo.github.io/serendipity/docs/components/party-service/overview/`
for the current component-level description (role, domain model, API surface,
validation, error contract, configuration, relationships).

### BFF profile endpoint (`/api/me`)

The BFF exposes a `/api/me`-style endpoint that returns the authenticated user's
`UserProfile` — identity attributes, roles, and enrichment attributes drawn from
the ID token and access token. This is the contract between the BFF and the PWA
for user identity. (Full endpoint contract — path, auth requirements, response
shape — to be captured here when the contract layer is written.)

### Other backend services

Serendipity's backend is modular (BFF + Party Service, with additional services
expected as the project grows). Each service's API surface should eventually be
captured here. None beyond the BFF and Party Service are documented in this layer
yet.

## Target state — what the contract layer should become

When the contract layer is implemented (roadmap item 🔄), this document (or its
successor) should cover:

- **OpenAPI specs** for each backend service — the authoritative, machine-readable
  contract for endpoints, request/response shapes, and error responses.
- **Generated client types** — consumer-typed clients derived from the OpenAPI
  specs, so the frontend and inter-service callers get type safety from the
  contract, not from hand-written models that can drift.
- **Contract tests** — tests that verify the running service matches its OpenAPI
  spec, so the contract document stays honest against the implementation.
- **RestClient / HTTP client configuration** — how the BFF and other services
  call each other (RestClient, WebClient, or equivalent), and how the access token
  is forwarded (Token Relay) in that calling layer.

Until that work is done, this document is the placeholder — the "what exists today"
section above is the true part, and the "target state" section is the directional
part.

## Relationship to the knowledge layer

This document is part of the `.knowledge/` layer's **integration** subsection —
the place where cross-cutting contracts between components live. When the full
contract layer lands, the OpenAPI specs themselves may live alongside the code
(e.g. `backend/modules/party-service/src/main/resources/openapi/` or similar), and
this document becomes the index and narrative around them rather than the spec
repository.

## Related documents

- [ADR-0004](./log.md#adr-0004) — Party Service trusts BFF as security boundary
  (relevant because the contract layer intersects with security/resource-server
  work)
- [Party Service component overview](https://robinyo.github.io/serendipity/docs/
  components/party-service/overview/) — current Party Service API surface
- [Backend — Security](./backend/security.md) — token relay and how the access
  token is forwarded in calls to backend services
- [Roadmap](https://robinyo.github.io/serendipity/docs/roadmap/) — the 🔄
  contract-layer item and the Party Service resource-server item
