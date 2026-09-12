# Overview

The Party Service is the core Spring Boot microservice that owns Serendipity's customer-engagement domain — individuals (contacts), organisations (accounts), and the relationships between them. It is a downstream service of the Backend for Frontend (BFF); the BFF relays authenticated API requests to the Party Service and passes the responses back to the Angular PWA.

## Role

The Party Service answers the questions "who are our customers" and "what are they called" — parties, names, addresses, roles, and the links between a contact and the account they belong to. It does not own workflow (that is Camunda) or authentication (that is Keycloak). It does own the Party aggregate.

In the current architecture it is the only business service the BFF talks to directly for customer data. The BFF's Spring Cloud Gateway routes `/api/party-service/**` to the Party Service and `/v2/user-tasks/**` to the orchestration cluster; the Party Service itself exposes a REST API under its own base path.

## Base path

The Party Service exposes two base paths:

- **`/organisations`**, **`/individuals`**, **`/contacts`**, **`/accounts`**, **`/roles`**, **`/electoral-divisions`** — the resource-oriented endpoints exposed through `BasePathAwareController` classes. The BFF maps these under its own `/api/party-service` prefix.
- **`/api/parties`**, **`/api/individual-names`** — additional endpoints exposed through `@RestController` classes directly under a fixed `/api` prefix.

The BFF's `application.yml` routes `/api/party-service/**` to `http://serendipity-party-service:8080/api/party-service`, so the PWA sees a single `/api/party-service/...` prefix for all Party Service traffic.

## Domain model

The Party Service owns the following entities (all in `org.serendipity.party.entity`):

### Party

The root aggregate. `Party` carries the shared identity and audit fields that every party subtype inherits — a `publicId` (the public-facing UUID), a `partyType`, and the auditable fields (created by, created date, last modified by, last modified date).

### Organisation

Represents an account — a company, a government department, a household, any organisation that is a customer or prospect. An Organisation has a `name`, `description`, `legalEntityType`, `industry`, `website`, `phoneNumber`, `email`, `address`, `billingAddress`, and links to an `Identifier` (the ABN in the Australian context).

### Individual

Represents a contact — a person. An Individual carries personal data: names (via a related `IndividualName`), address, `dateOfBirth`, `placeOfBirth`, `countryOfBirth`, `dateOfDeath`, `placeOfDeath`, `countryOfDeath`, `sex`, `gender`, `email`, `phoneNumber`, `faxNumber`, `preferredContactMethod`, `jobTitle`, and links to an `electoralDivision`, `location`, and `Identifier`. An Individual can belong to an Organisation (the contact is associated with an account) — that relationship is represented in the data model and is surfaced by the service.

### IndividualName

Names are modelled separately from the Individual itself so a person can have multiple names (e.g. a preferred name plus a legal name). `IndividualName` holds `title`, `givenName`, `preferredName`, `middleName`, `familyName`, `initials`, `honorific`, and `salutation`. The Individual has a primary name and can have additional names.

### Address

An address entity used by both Organisations and Individuals. Holds `streetNumber`, `streetName`, `suburb`, `state`, `postcode`, `country`, and geographic coordinates where available.

### Role

A role assigned to a party — e.g. "Customer", "Prospect", "Employee", "Vendor". Roles are tie-lines between a party and some classification; they are surfaced through the Party Controller's `/api/parties/{partyPublicId}/roles` endpoint.

### Identifier

An external identifier — in the Australian context, the ABN (Australian Business Number). An Organisation can have an Identifier; this is the link between a Serendipity Organisation and an external registry.

### ElectoralDivision

A geographic electoral division used to classify contacts by electorate. Pre-seeded from Australian electoral data (see `backend/modules/party-service/src/main/java/org/serendipity/party/database/seed/au/`).

### Location

A geographic location with latitude and longitude, used to classify where a party is located.

### Name

A generic name entity used in the domain model — the IndividualName extends this.

## API surface

The BFF relays these endpoints to the PWA. Unless noted otherwise, the Party Service returns a Spring HATEOAS `RepresentationModel` (or `PagedModel` for collections) and uses the RFC 7807 Problem Detail format for errors.

### Organisations (accounts)

| Method | Path | Description |
|---|---|---|
| GET | `/organisations` | Paginated list of organisations |
| GET | `/organisations/search/findByNameStartsWith?name=...` | Search organisations by name prefix |
| GET | `/organisations/{publicId}` | A single organisation by publicId |
| POST | `/organisations` | Create an organisation |
| PUT | `/organisations/{publicId}` | Update an organisation |
| DELETE | `/organisations/{publicId}` | Delete an organisation |
| PUT | `/accounts/{publicId}` | Alias endpoint for updating an account (same DTO as `/organisations/{publicId}`) |

### Individuals (contacts)

| Method | Path | Description |
|---|---|---|
| GET | `/individuals` | Paginated list of individuals |
| GET | `/individuals/search/findByFamilyNameStartsWith?name=...` | Search individuals by family name prefix |
| GET | `/individuals/{publicId}` | A single individual by publicId |
| POST | `/individuals` | Create an individual |
| PUT | `/individuals/{publicId}` | Update an individual |
| DELETE | `/individuals/{publicId}` | Delete an individual |
| PUT | `/contacts/{publicId}` | Alias endpoint for updating a contact (same DTO as `/individuals/{publicId}`) |
| GET | `/individuals/{id}` | Admin endpoint — individual by internal ID |

### Individual names

| Method | Path | Description |
|---|---|---|
| GET | `/api/individual-names/{partyPublicId}` | All names for a given party |

### Roles

| Method | Path | Description |
|---|---|---|
| GET | `/api/parties/{partyPublicId}/roles` | Roles for a given party |
| GET | `/roles` | Paginated list of roles |
| GET | `/roles/search/findByPartyId?partyId=...` | Roles by party ID |
| GET | `/roles/{id}` | A single role by internal ID |

### Electoral divisions

| Method | Path | Description |
|---|---|---|
| GET | `/electoral-divisions` | Paginated list of electoral divisions |
| GET | `/electoral-divisions/search/findByName?name=...` | Find an electoral division by name |

### Party-level roles

| Method | Path | Description |
|---|---|---|
| GET | `/api/parties/{partyPublicId}/roles` | Collection of roles for a party |

## Validation

Update DTOs are validated with Jakarta Bean Validation. The Party Service uses `spring-boot-starter-validation` (declared in `backend/modules/party-service/pom.xml`).

Validation annotations are on the update DTOs, not on the entity. The DTOs that carry validation are:

- `OrganisationUpdateDto` — `@NotBlank(message = "Name is mandatory")` on `name`
- `IndividualUpdateDto` — `@Valid NameUpdateDto name`, where:
  - `NameUpdateDto` — `@NotBlank(message = "Given name is mandatory")` on `givenName` and `@NotBlank(message = "Family name is mandatory")` on `familyName`

When a `PUT` to `/organisations/{publicId}` or `/accounts/{publicId}` sends a body where the required `name` is missing or blank, the Party Service rejects it with a 400. When a `PUT` to `/individuals/{publicId}` or `/contacts/{publicId}` sends a body where the required `givenName` or `familyName` is missing or blank, the same happens — but the field-level message reports the specific field ("Given name is mandatory" or "Family name is mandatory").

The domain model enforces the split cleanly: Organisations have a `name`; Individuals have a name composed of `givenName` + `familyName` (plus title, middle name, etc.). An `OrganisationUpdateDto` has no `givenName` or `familyName` field at all, so the validator never sees them on an account update.

## Error contract

The Party Service returns errors using Spring Boot's RFC 7807 Problem Detail format (`application/problem+json`). Every error response has the same top-level shape:

| Field | Present | Notes |
|---|---|---|
| `type` | Sometimes | URI identifying the error type — absent unless explicitly set |
| `title` | Yes | Short label, e.g. "Resource Not Found", "Validation Failed", "Malformed Request", "Internal Server Error" |
| `status` | Yes | HTTP status code |
| `detail` | Yes | Human-readable explanation |
| `instance` | No | URI identifying the specific occurrence |
| `timestamp` | Yes | When the error was produced (non-standard extension) |

The handlers are in `org.serendipity.party.exception.GlobalExceptionHandler`:

| Scenario | Handler | Response |
|---|---|---|
| Resource not found | `handleResourceNotFoundException` | 404 Problem Detail with the resource message |
| Validation failure (a `@Valid` DTO fails) | `handleMethodArgumentNotValid` (override of the parent) | 400 Problem Detail + `errors` extension |
| Malformed JSON / unknown field (Jackson cannot parse) | `handleHttpMessageNotReadable` (override of the parent) | 400 Problem Detail |
| Unexpected error | `handleGlobalException` (catch-all `Exception`) | 500 Problem Detail |

For validation failures specifically, the response includes an `errors` extension listing each invalid field:

```json
{
  "type": "about:blank",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more fields failed validation.",
  "timestamp": "2026-09-12T16:01:13.300+10:00",
  "errors": [
    { "field": "givenName", "message": "Given name is mandatory", "rejectedValue": null }
  ]
}
```

Each entry in `errors` has:

- `field` — the field name from the DTO
- `message` — the validation message from the annotation (e.g. `@NotBlank(message = "Given name is mandatory")`)
- `rejectedValue` — the value that was rejected, or `"null"` if the field was absent

This is the field-level visibility that matters for command validation: which field failed and why. The BFF relays these responses to the PWA without transforming them, so the Angular HTTP layer sees the same `ProblemDetail` shape the Party Service produces.

## Configuration

The Party Service is configured through `backend/modules/party-service/pom.xml` and the shared `backend/pom.xml`:

- Parent: `spring-boot-starter-parent` version **4.0.1**
- Java: **25**
- Dependencies:
  - `spring-boot-starter-validation` — Jakarta Bean Validation for update DTOs
  - `spring-boot-starter-data-jpa` (inherited) — JPA / Hibernate for persistence
  - `spring-boot-starter-data-rest` (inherited) — `BasePathAwareController` and repository-exposed search endpoints
  - `spring-boot-starter-actuator` (inherited from parent pom) — health, metrics, info endpoints
  - `lombok` (provided) — boilerplate reduction
  - `mapstruct` + `lombok-mapstruct-binding` — mapper generation for DTO↔entity conversion
- The Party Service connects to PostgreSQL via the storage service (configured in `backend/docker-compose.yml`: `serendipity-storage-service` and `SPRING_DATASOURCE_URL` on the Party Service).
- Database seeds (Australian political parties, house of representatives members, senate members, electoral divisions) are loaded at startup from `backend/modules/party-service/src/main/java/org/serendipity/party/database/seed/au/`.

## Relationship to the BFF

The BFF is the Party Service's primary consumer. The BFF:

- Authenticates the user with Keycloak (OAuth 2.0 Authorization Code flow).
- Relays the user's access token to downstream services via `TokenRelayFilterFunctions.tokenRelay()`.
- Routes `/api/party-service/**` to `http://serendipity-party-service:8080/api/party-service`.
- Passes responses back to the Angular PWA.

The Party Service does not authenticate requests itself in the current setup — the BFF is a confidential OAuth 2.0 client and the trust boundary sits at the BFF. The Party Service trusts the BFF's requests; if that changes, the Party Service's security configuration would need to be reconsidered (e.g. validating the forwarded token, requiring `Authorization: Bearer ...` headers, or deploying as an OAuth 2.0 resource server).

## Relationship to other services

- **BFF** — consumes the Party Service's REST API under `/api/party-service`.
- **Orchestration / Camunda** — is a separate concern. The Party Service owns the customer data; Camunda owns the workflow that acts on that data (e.g. a task to follow up a new contact). The Party Service does not start processes or claim Camunda tasks.
- **Keycloak** — is the identity provider. The Party Service does not depend on Keycloak directly; user identity is established at the BFF.
- **Storage Service (PostgreSQL)** — is the database the Party Service writes to. In the Docker Compose setup, both the Party Service and the Identity Service share the storage PostgreSQL instance (separate databases).

## Testing

The Party Service has an architecture test suite (`org.serendipity.party.architecture.ArchitectureTests`) that enforces structural conventions on the code. There is no dedicated integration test suite for the REST endpoints in the current codebase; the `PartyServiceApplicationTests.contextLoads` smoke test verifies the application context starts.

## Database seeds

On startup the Party Service seeds Australian political data — parties (Australian Labor Party, Liberal National Party of Queensland, National Party of Australia, Australian Greens, etc.), members of the House of Representatives, and members of the Senate. This is useful for demonstration and for teams working in the Australian context. The seed data lives in `backend/modules/party-service/src/main/java/org/serendipity/party/database/seed/au/` and is loaded by the seed classes on first startup.

## OpenAPI note

The Party Service does not currently expose an OpenAPI / Swagger document. If you need an API reference for the Party Service, the endpoints above are the current surface — but an OpenAPI spec would make this page redundant in favour of a generated reference. That is the `Add API reference (OpenAPI / Springdoc)` item in the roadmap.

