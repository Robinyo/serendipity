# Party Service — Design Document

## Purpose

This document describes the Party Service's **entity model** as it exists in the codebase — the entities, their fields, their relationships, and the patterns they follow. It is a reference for the access-control designer and for anyone extending the Party Service, not an implementation plan. It assumes the party-service module under `backend/modules/party-service/` is the source of truth.

The Party Service answers "who are our customers and what are they called" — parties, names, addresses, roles, and the links between a contact and the account they belong to. The entity model is the foundation for that answer.

## Scope

This document covers the entity layer (`org.serendipity.party.entity`) and the companion models (`org.serendipity.party.model`) that the API exposes. It does not cover the database seeds, the repository interfaces in detail, or the service-layer orchestration — those are described in the [Party Service overview page](./../../components/party-service/overview).

## Entity topology

The Party Service uses a **shared primary key** pattern. `Party` is the root aggregate. `Organisation` and `Individual` share `Party`'s primary key — they do not have their own generated identifiers. Instead, each subtype's `id` is mapped from the `Party`'s `id` via `@MapsId` on a `@OneToOne` to `Party`.

```
Party (root aggregate, one row per party)
  ├── Organisation (shared PK, one row per organisation party)
  └── Individual (shared PK, one row per individual party)
        └── IndividualName (collection, one row per name variant)
```

Side entities that are not subtypes of `Party`:

```
Location  (root aggregate, one row per location — addresses and electronic addresses)
  └── Address (shared PK, one row per address location)

ElectoralDivision  (standalone, seeded reference data)

Identifier  (standalone, external identifier with lifecycle)

Role  (standalone, tie-line between a party and a classification; has its own lifecycle)
```

The shared primary key pattern means:

- There is exactly one `Party` row per logical party.
- An `Organisation` exists only if there is a `Party` of type `ORGANISATION`.
- An `Individual` exists only if there is a `Party` of type `INDIVIDUAL`.
- The subtype's identity is the `Party`'s identity — you do not look up an `Organisation` by a separate key; you look it up by the `Party`'s `publicId` via `findByPartyPublicId`.

The root `Party` carries the fields shared by every party subtype: `publicId`, `type`, `legalEntityType`, `displayName`, the audit fields, and the collection ties to `Address` and `Role`.

## Party (root aggregate)

`Party` is the root aggregate. It is the entry point for every party — you create a `Party` first, then attach an `Organisation` or `Individual` to it. The subtype's existence is implied by the `Party`'s `type`.

File: `entity/Party.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Generated sequence, root of the shared PK |
| `publicId` | `String` (UUID) | Stable, public-facing identifier. Nullable=false, unique, not updatable. This is the value used in the API and stored in `ownedBy` / `assignedTo` for access control. |
| `type` | `PartyType` | `INDIVIDUAL` or `ORGANISATION` (or `ORGANISATIONAL_UNIT` in the enum). Defaults to `INDIVIDUAL`. |
| `legalEntityType` | `String` | Empty string by default. |
| `displayName` | `String` | Empty string by default. |
| `fromDate` | `LocalDate` | Nullable — party effective date. |
| `toDate` | `LocalDate` | Nullable — soft-delete date. Set when the party is soft-deleted; the `@SQLRestriction` excludes soft-deleted rows from normal queries. |
| `addresses` | `Set<Address>` | Many-to-many (join table `PartyAddress`). EAGER fetch. |
| `roles` | `Set<Role>` | Many-to-many (join table `PartyRole`). EAGER fetch. |
| `audit` | `Auditable` (embedded) | `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. Populated by Spring Data JPA auditing. |

Key observations:

- `Party` is annotated `@SQLRestriction("to_date IS NULL OR to_date > CURRENT_DATE")`. Soft-deleted parties (and subtypes) are excluded from normal repository queries without special handling in the service layer.
- `@Setter` is present on `Party` — the entity is mutable. The setters are used by the service layer and the update DTOs.
- `@EntityListeners(AuditingEntityListener.class)` drives the `Auditable` timestamps and user fields. The `createdBy` / `updatedBy` values come from the security context (or a configured auditor); in the current setup the Party Service does not authenticate requests, so those fields may be populated by the BFF or by a configured auditor.
- `@ManyToMany` with `CascadeType.PERSIST, CascadeType.MERGE` on `addresses` and `roles` means new `Address` and `Role` instances attached to a `Party` are persisted/merged when the `Party` is saved. The comment on the class notes that deleting a `Party` only deletes the join-table rows (not the shared `Address` and `Role` rows).

## Organisation (account)

`Organisation` represents an account — a company, a government department, a household. It shares `Party`'s primary key.

File: `entity/Organisation.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Shared PK from `Party`. `@MapsId` on the `@OneToOne` to `Party`. |
| `party` | `Party` | `@OneToOne(fetch=EAGER)`, `@MapsId`. This is how the shared PK is wired. |
| `name` | `String` | The organisation's name. Nullable — no `@Column(nullable=false)`. The `OrganisationUpdateDto` validates `name` as `@NotBlank`, so the API layer enforces it even though the entity does not. |
| `email` | `String` | Nullable. |
| `phoneNumber` | `String` | Nullable. |
| `faxNumber` | `String` | Nullable. |
| `preferredContactMethod` | `String` | Nullable. |
| `establishmentDate` | `LocalDate` | Nullable. |

Key observations:

- `Organisation` has very few fields as shipped — `name`, `email`, `phoneNumber`, `faxNumber`, `preferredContactMethod`, `establishmentDate`. It does **not** currently carry `legalEntityType`, `industry`, `website`, `billingAddress`, or `address` as separate fields on the entity. Those fields appear in the Party Service overview page's domain-model description but are not present on the `Organisation` entity. The entity is the source of truth; the overview page's description should be treated as aspirational or stale where it conflicts.
- There is no `description` field on the entity (the overview page lists `description` — not present on the entity).
- There is no `partyPublicId` column on `Organisation` — the shared PK means `Organisation`'s `id` is the `Party`'s `id`. Repositories look up by `Party.publicId` via `findByPartyPublicId`.
- `@Setter` is present — the entity is mutable.

## Individual (contact)

`Individual` represents a contact — a person. It shares `Party`'s primary key.

File: `entity/Individual.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Shared PK from `Party`. `@MapsId` on the `@OneToOne` to `Party`. |
| `party` | `Party` | `@OneToOne(fetch=EAGER)`, `@MapsId`. |
| `name` | `Name` (embeddable) | The individual's **primary** name — title, givenName, preferredName, middleName, familyName, initials, honorific, salutation. `@Embedded`. `familyName` is `@Column(nullable=false)` on the `Name` embeddable. |
| `names` | `Set<IndividualName>` | Additional name variants. `@OneToMany(mappedBy="individual", fetch=EAGER, cascade=CascadeType.ALL, orphanRemoval=true)`. Default is an empty `HashSet`. |
| `jobTitle` | `String` | Nullable. |
| `sex` | `String` | Nullable. |
| `gender` | `String` | Nullable. |
| `email` | `String` | Nullable. |
| `phoneNumber` | `String` | Nullable. |
| `faxNumber` | `String` | Nullable. |
| `preferredContactMethod` | `String` | Nullable. |
| `photoUrl` | `String` | Nullable. |
| `electorate` | `String` | Nullable — free-text electorate (not linked to `ElectoralDivision` on the entity). |
| `dateOfBirth` | `LocalDate` | Nullable. |
| `placeOfBirth` | `String` | Nullable. |
| `countryOfBirth` | `String` | Nullable. |
| `dateOfDeath` | `LocalDate` | Nullable. |
| `placeOfDeath` | `String` | Nullable. |
| `countryOfDeath` | `String` | Nullable. |

Key observations:

- `Individual` has a **primary name** (`name`) and a **collection of additional names** (`names`). The primary name is embedded; additional names are separate entities (`IndividualName`). This is the model's way of supporting multiple name variants for one person.
- `Name.familyName` is `@Column(nullable=false)` on the embeddable — a `Name` cannot be persisted without a family name. This is separate from the DTO validation (`NameUpdateDto` requires `givenName` and `familyName`); the embeddable constraint is on the entity, the DTO constraint is on the API input.
- `sex` and `gender` are both present as separate nullable strings. The field names suggest different semantics (biological sex vs gender identity) but neither has a constrained set of values on the entity.
- `electorate` is a free-text string, not a foreign key to `ElectoralDivision`. If electorate-based access or grouping is needed, the model would need a link to `ElectoralDivision` (or a decision that free text is sufficient).
- There is **no `ownedBy` / `assignedTo` / `assignedToTeam`** on `Individual` or `Organisation` — the access-control model's ownership/assignment fields are not yet on the entity. The `Party.audit` fields (`createdBy`, `updatedBy`) exist but are about who last touched the record, not about who owns it.
- There is **no `managedBy` / manager hierarchy** field on `Party` — the access-control model's manager hierarchy is not yet represented on the entity. Where it lives is decided by the access-control model: the owning user's `manager` is a Keycloak user attribute (the `sub` of the owning user's manager), not a Serendipity field. If `Party.ownedByManager` is added as a convenience field, it mirrors that attribute; the entity does not store the hierarchy itself.
- `@Setter` is present — the entity is mutable.

## IndividualName (name variant)

`IndividualName` is a separate entity for a person's additional name variants — a preferred name, a former name, a legal name that differs from the primary name. It is not the primary name (that is the embedded `Name` on `Individual`).

File: `entity/IndividualName.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Generated sequence. |
| `publicId` | `String` (UUID) | Stable, public-facing identifier. Nullable=false, unique, not updatable. |
| `individual` | `Individual` | `@ManyToOne(fetch=LAZY, optional=false)`. The owning individual. |
| `type` | `String` | Nullable=false — the kind of name (e.g. "Preferred", "Legal", "Former"). |
| `name` | `Name` (embeddable) | The name itself — same embeddable as `Individual.name`. |
| `fromDate` | `LocalDate` | Nullable — when this name became effective. |
| `toDate` | `LocalDate` | Nullable — soft-delete date. `@SQLRestriction` excludes soft-deleted names. |
| `audit` | `Auditable` (embedded) | `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. |

Key observations:

- `IndividualName` has its own `publicId` and its own `toDate` soft delete — a name variant can be soft-deleted independently of the individual.
- `@SQLRestriction` on `IndividualName` — soft-deleted name variants are excluded from normal queries.
- `@EntityListeners(AuditingEntityListener.class)` — the `audit` fields are populated by Spring Data JPA auditing.
- `type` is a free-text string, not an enum. If a constrained set of name types is wanted (e.g. "Preferred", "Legal", "Former", "Maiden"), that would be a future extension.
- `@Setter` is present — the entity is mutable.

## Name (embeddable)

`Name` is the shared embeddable used by both `Individual.name` (the primary name) and `IndividualName.name` (each additional name variant). It is not a top-level entity — it lives inside an `Individual` or an `IndividualName`.

File: `entity/Name.java`

| Field | Type | Notes |
|---|---|---|
| `title` | `String` | Nullable — e.g. "Dr", "Ms". |
| `givenName` | `String` | Nullable. |
| `preferredName` | `String` | Nullable. |
| `middleName` | `String` | Nullable. |
| `familyName` | `String` | **Nullable=false** — the one required field on the embeddable. |
| `initials` | `String` | Nullable. |
| `honorific` | `String` | Nullable. |
| `salutation` | `String` | Nullable. |

Key observations:

- `familyName` is the only non-nullable field — a `Name` cannot be persisted without a family name. This is a general constraint on any name in the system, not just the primary name.
- The embeddable has no identity of its own — it is persisted as columns on the owning entity's table. `Individual` stores `name_*` columns on its table; `IndividualName` stores them on its own table.
- The DTO `NameUpdateDto` applies its own `@NotBlank` constraints (`givenName`, `familyName`) on API input — those are about what the caller must supply, not about what the database requires.

## Address

`Address` is an address entity. It shares `Location`'s primary key — `Address` is a subtype of `Location`, just as `Individual` is a subtype of `Party`.

File: `entity/Address.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Shared PK from `Location`. `@MapsId` on the `@OneToOne` to `Location`. |
| `location` | `Location` | `@OneToOne(fetch=EAGER)`, `@MapsId`. |
| `name` | `String` | Nullable — a label for the address. |
| `line1` | `String` | Nullable. |
| `line2` | `String` | Nullable. |
| `city` | `String` | Nullable. |
| `state` | `String` | Nullable. |
| `postalCode` | `String` | Nullable. |
| `country` | `String` | Nullable. |
| `addressType` | `String` | Nullable — the kind of address (e.g. "Billing", "Mailing", "Residential"). |

Key observations:

- `Address` is attached to a `Party` via the `Party.addresses` many-to-many. Multiple parties can share the same address (the join table `PartyAddress` links parties to locations/addresses).
- `addressType` is free text, not an enum. If a constrained set of address types is wanted, that is a future extension.
- `@Setter` is present — the entity is mutable.

## Location (base for Address)

`Location` is the root aggregate for geographic/location entities. `Address` is the only subtype of `Location` in the current codebase.

File: `entity/Location.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Generated sequence. |
| `publicId` | `String` (UUID) | Stable, public-facing identifier. Nullable=false, unique, not updatable. |
| `type` | `LocationType` | `ADDRESS` or `ELECTRONIC_ADDRESS`. Defaults to `ADDRESS`. |
| `displayName` | `String` | Empty string by default. |
| `fromDate` | `LocalDate` | Nullable. |
| `toDate` | `LocalDate` | Nullable — soft delete. `@SQLRestriction` excludes soft-deleted locations. |
| `audit` | `Auditable` (embedded) | `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. |

Key observations:

- `Location` is the geographic analogue of `Party` — a root aggregate with a `publicId`, a `type`, soft delete, and audit fields.
- `LocationType` is an enum with `ADDRESS` and `ELECTRONIC_ADDRESS`. If other location types are wanted (e.g. "Geographic Area"), the enum would need to be extended.
- `@EntityListeners(AuditingEntityListener.class)` — audit fields populated by Spring Data JPA auditing.

## ElectoralDivision

`ElectoralDivision` is a standalone entity for Australian electoral divisions, seeded from Australian electoral data at startup.

File: `entity/ElectoralDivision.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Generated sequence. |
| `publicId` | `String` (UUID) | Stable, public-facing identifier. Nullable=false, unique, not updatable. |
| `name` | `String` | Nullable=false. |
| `nameDerivation` | `String` | Nullable. |
| `state` | `String` | Nullable. |
| `area` | `String` | Nullable. |
| `locationDescription` | `String` | Nullable. |
| `dateGazetted` | `LocalDate` | Nullable. |
| `latitude` | `String` | Nullable — stored as a string, not a numeric type. |
| `longitude` | `String` | Nullable — stored as a string, not a numeric type. |
| `fromDate` | `LocalDate` | Nullable. |
| `toDate` | `LocalDate` | Nullable — soft delete. `@SQLRestriction` excludes soft-deleted divisions. |
| `audit` | `Auditable` (embedded) | `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. |

Key observations:

- `latitude` and `longitude` are stored as `String`, not as numeric types. This is intentional (or at least as-shipped) — the seed data uses string values.
- `ElectoralDivision` is reference data — it is seeded and read, not created by end users through the Party Service API. It does not carry `ownedBy` or `assignedTo`.
- `@SQLRestriction` — soft-deleted divisions are excluded from normal queries.

## Identifier

`Identifier` is a standalone entity for an external identifier — in the Australian context, an ABN. It has its own lifecycle and is not part of the `Party` aggregate.

File: `entity/Identifier.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Generated sequence. |
| `publicId` | `String` (UUID) | Stable, public-facing identifier. Nullable=false, unique, not updatable. |
| `type` | `String` | Nullable=false — the kind of identifier (e.g. "ABN"). |
| `value` | `String` | Nullable=false — the identifier value itself (e.g. "85 087 326 690"). Column named `"value"` (quoted). |
| `register` | `String` | Nullable=false — the register the identifier came from (e.g. "Australian Business Register"). |
| `lifecycleStatus` | `String` | Nullable — the identifier's status (e.g. "Active"). |
| `fromDate` | `LocalDate` | Nullable. |
| `toDate` | `LocalDate` | Nullable — soft delete. `@SQLRestriction` excludes soft-deleted identifiers. |
| `audit` | `Auditable` (embedded) | `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. |

Key observations:

- `Identifier` has its own `publicId` and lifecycle — it is not owned by a `Party` on the entity. The Party Service overview page describes an Organisation as being "linked to an Identifier (the ABN)," but the `Organisation` entity does not have an `Identifier` relationship field. If an Organisation-to-Identifier link is intended, it is not on the entity as shipped.
- `value` is quoted as a column name (`"value"`) because `value` is a reserved word in some contexts.
- `type` and `value` are `String`, not enums — the identifier type is free text.

## Role

`Role` is a standalone entity for a role tied to a party — e.g. "Customer", "Prospect", "Employee", "Vendor". It is a tie-line between a party and a classification, with a lifecycle.

File: `entity/Role.java`

| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | Generated sequence. |
| `publicId` | `String` (UUID) | Stable, public-facing identifier. Nullable=false, unique, not updatable. |
| `role` | `String` | Nullable=false, defaults to "Member". The role name. |
| `partyPublicId` | `String` | Nullable=false — the publicId of the party this role is for. |
| `partyType` | `PartyType` | Nullable=false — the type of the party. |
| `partyName` | `String` | Nullable=false — the party's name (denormalised). |
| `partyEmail` | `String` | Nullable=false — the party's email (denormalised). |
| `partyPhoneNumber` | `String` | Nullable=false — the party's phone (denormalised). |
| `relationship` | `String` | Defaults to "Membership". The relationship kind. |
| `reciprocalRole` | `String` | Defaults to "Organisation". The reciprocal role. |
| `reciprocalPartyPublicId` | `String` | Nullable=false — the publicId of the reciprocal party. |
| `reciprocalPartyType` | `PartyType` | Nullable=false — the type of the reciprocal party. |
| `reciprocalPartyName` | `String` | Nullable=false — the reciprocal party's name (denormalised). |
| `reciprocalPartyEmail` | `String` | Nullable=false — the reciprocal party's email (denormalised). |
| `reciprocalPartyPhoneNumber` | `String` | Nullable=false — the reciprocal party's phone (denormalised). |
| `fromDate` | `LocalDate` | Nullable. |
| `toDate` | `LocalDate` | Nullable — soft delete. `@SQLRestriction` excludes soft-deleted roles. |
| `audit` | `Auditable` (embedded) | `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. |

Key observations:

- `Role` is a tie-line — it links one party to another party with roles on both sides. The "reciprocal" fields describe the other side of the relationship. This is more than a simple label on a party; it is a relationship entity.
- The party fields on `Role` (`partyName`, `partyEmail`, `partyPhoneNumber`, and their reciprocals) are **denormalised** — they are copied from the party at role-creation time, not read from the party each time. If the party's name or email changes, the role's denormalised copy does not update automatically.
- `Role` is attached to a `Party` via the `Party.roles` many-to-many. Deleting a `Party` only removes the join-table rows, not the `Role` rows (per the `Party` class comment).
- `role` defaults to "Member" — if a role is created without an explicit role name, it becomes "Member".
- `@SQLRestriction` — soft-deleted roles are excluded from normal queries.

## PartyType and LocationType

`PartyType` is the enum on `Party.type` and `Role.partyType` / `reciprocalPartyType`.

File: `type/PartyType.java`

| Value | Notes |
|---|---|
| `INDIVIDUAL` | A person. |
| `ORGANISATION` | An organisation. |
| `ORGANISATIONAL_UNIT` | An organisational unit — in the enum, but the entity model does not currently have a subtype for it. |

`LocationType` is the enum on `Location.type`.

File: `type/LocationType.java`

| Value | Notes |
|---|---|
| `ADDRESS` | A physical or mailing address. |
| `ELECTRONIC_ADDRESS` | An electronic address (e.g. email, URL). |

Key observations:

- `PartyType.ORGANISATIONAL_UNIT` is in the enum but there is no `OrganisationalUnit` entity subtype. If organisational units become a first-class party type, a new entity subtype (sharing `Party`'s PK) would be needed, and `PartyType.ORGANISATIONAL_UNIT` would be wired to it.
- The enum has commented-out `@JsonProperty` annotations and commented-out additional values (`EMPLOYMENT_POSITION`, `PARTY`) — the enum is not closed to extension.

## Soft delete

Soft delete is implemented consistently across the entities that carry `toDate`:

- `Party` — `@SQLRestriction("to_date IS NULL OR to_date > CURRENT_DATE")`.
- `IndividualName` — same restriction.
- `Role` — same restriction.
- `Location` — same restriction.
- `Address` inherits the restriction via `Location` (the `Party.addresses` many-to-many uses `Address`, which uses `Location`'s restriction).
- `ElectoralDivision` — same restriction.
- `Identifier` — same restriction.

The `deleteByPartyPublicId` methods on the repositories (e.g. `IndividualRepository.deleteByPartyPublicId`) perform a JPA delete on the subtype row. Because of `@SQLRestriction`, the soft-deleted row is excluded from future normal queries without additional logic. The service-layer `deleteByPartyPublicId` methods in `IndividualService` and `OrganisationService` first check `existsByPartyPublicId` (which uses the restricted query) and then delete.

Note: `Individual` and `Organisation` themselves do **not** carry a `toDate` field — only `Party` does. Soft-deleting an `Individual` or `Organisation` means soft-deleting the underlying `Party` (setting `Party.toDate`). The subtype rows are deleted by the repository delete, but the soft-delete semantics apply to the `Party`. The exact behavior depends on how the repository delete is implemented relative to the `Party` row — this is a point to verify when implementing the access-control model's delete path (which should soft-delete, not hard-delete, per ADR-0002).

## Audit fields

All root aggregates (`Party`, `Location`, `IndividualName`, `Role`, `ElectoralDivision`, `Identifier`) carry an embedded `Auditable`:

| Field | Annotation | Notes |
|---|---|---|
| `createdAt` | `@CreatedDate` | Populated at insert. |
| `updatedAt` | `@LastModifiedDate` | Updated on each save. |
| `createdBy` | `@CreatedBy` | The user who created the record. |
| `updatedBy` | `@LastModifiedBy` | The user who last modified the record. |

`Auditable` is an `@Embeddable` with `@Setter`/`@Getter`. The values are populated by `AuditingEntityListener`, which reads from Spring Data JPA's auditor provider. In the current setup the Party Service does not authenticate requests, so the auditor is either configured explicitly or defaults to a system value — the access-control model's `ownedBy` / `assignedTo` fields are about **record ownership and assignment**, which is different from **who last modified the record**. Do not rely on `createdBy` / `updatedBy` as a substitute for `ownedBy`.

## API exposure

The entities are exposed through Spring HATEOAS `RepresentationModel` classes. These are projections, not the entities themselves. The key models:

| Model | Extends | Fields |
|---|---|---|
| `PartyModel` | `RepresentationModel<PartyModel>` | `id`, `type`, `legalEntityType`, `displayName`, `addresses`, `roles`, `toDate`. |
| `OrganisationModel` | `RepresentationModel<OrganisationModel>` | `id`, `party`, `name`, `email`, `phoneNumber`, `faxNumber`, `preferredContactMethod`, `establishmentDate`. |
| `IndividualModel` | `RepresentationModel<IndividualModel>` | `id`, `party`, `name`, `names`, `jobTitle`, `sex`, `gender`, `email`, `phoneNumber`, `faxNumber`, `preferredContactMethod`, `photoUrl`, `electorate`, `dateOfBirth`, `placeOfBirth`, `countryOfBirth`, `dateOfDeath`, `placeOfDeath`, `countryOfDeath`. |
| `NameModel` | `RepresentationModel<NameModel>` | `title`, `givenName`, `preferredName`, `middleName`, `familyName`, `initials`, `honorific`, `salutation`. |
| `AddressModel` | `RepresentationModel<AddressModel>` | (address fields — line1, line2, city, state, postalCode, country, etc.) |
| `RoleModel` | `RepresentationModel<RoleModel>` | (role fields) |
| `IndividualNameModel` | `RepresentationModel<IndividualNameModel>` | (name variant fields) |
| `IndividualSummaryModel` | `RepresentationModel<IndividualSummaryModel>` | summary projection for individuals. |
| `OrganisationSummaryModel` | `RepresentationModel<OrganisationSummaryModel>` | summary projection for organisations. |

Key observations:

- The models use `String` for date fields (`toDate`, `dateOfBirth`, `establishmentDate`, etc.) — they are serialised as strings, not as `LocalDate` objects in the JSON. This is a serialisation choice, not an entity choice.
- `IndividualModel` exposes the full individual surface — every field on the entity is present on the model. There is no field-level projection that hides fields based on the caller's role (the access-control model's field-level security, if needed, would be a future extension).
- The models do **not** carry `ownedBy` / `assignedTo` / `assignedToTeam` — because the entity does not have those fields yet. When the access-control model is implemented, the models will need to include those fields (or the API will need to add them).

## Relationship to the access-control model (current shape)

The access-control design document defines ownership and assignment fields that the Party Service entity model does not yet carry:

| Access-control field | Entity field as shipped | Status |
|---|---|---|
| `Party.ownedBy` (Keycloak `sub`) | Not present | To be added to `Party`. |
| `Party.assignedTo` (Keycloak `sub`) | Not present | To be added to `Party`. |
| `Party.assignedToTeam` (Keycloak group name) | Not present | To be added to `Party`. |
| `Party.ownedByManager` (convenience field for manager hierarchy) | Not present | To be added to `Party`. |
| `User.managedBy` (manager hierarchy, on a Serendipity-internal User) | Not present — no User entity in Party Service, and not needed | The manager hierarchy is a Keycloak concept, not a Serendipity entity. The owning user's manager is stored as a Keycloak user attribute (`manager`, value = the `sub` of the owning user's manager). The Party Service reads it from the token (via a User Attribute mapper) or from Keycloak at enforcement time; it does not read a Serendipity `User.managedBy` field. If a convenience field is wanted on the entity, `Party.ownedByManager` mirrors the owning user's `manager` attribute. |

The access-control model's `Role.system-administrator`, `Role.sales-manager`, `Role.salesperson`, `Role.basic-user` are **Keycloak roles**, not `PartyService.Role` entities. The `party-service.entity.Role` is a business-domain role (Customer, Prospect, Employee, Vendor) — a tie-line between parties. Do not confuse the two. The access-control roles are carried in the access token; the Party Service's `Role` entities are part of the customer-engagement domain data.

## Consistency notes

- **Party → Organisation naming.** The entity model calls the account type "Organisation"; the access-control model and the product calls it "Account". These are the same thing — an `Organisation` is an account. The design document should be consistent about which term it uses and note the equivalence. The Party Service overview page uses both — the entity is `Organisation`, the API has `/accounts/{publicId}` as an alias endpoint.
- **Organisation entity fields vs overview page description.** The Party Service overview page lists `Organisation` as having `description`, `legalEntityType`, `industry`, `website`, `address`, `billingAddress`, and an `Identifier` link. The `Organisation` entity as shipped has only `name`, `email`, `phoneNumber`, `faxNumber`, `preferredContactMethod`, `establishmentDate`. The entity is the source of truth; the overview page's description is stale or aspirational where it conflicts. Update the overview page to match the entity, or add the missing fields to the entity and then update the overview page.
- **Individual → Contact naming.** Same as Organisation/Account — `Individual` is the entity, "Contact" is the product term. The API has `/contacts/{publicId}` as an alias for `/individuals/{publicId}`.
- **`electorate` is free text.** The `Individual.electorate` field is a `String`, not a link to `ElectoralDivision`. If electorate-based grouping or access is wanted (the access-control model currently says scope is not a requirement), this field would need to become a foreign key or a decision that free text is sufficient.
- **No `User` entity in the Party Service.** The access-control model's manager hierarchy is on a "User" — but the Party Service has no `User` entity. The Party Service's entities are `Party`, `Individual`, `Organisation`, etc. — these are customer-engagement domain objects, not user-management objects. The user is a Keycloak user, not a Serendipity table row. The manager hierarchy lives as a Keycloak user attribute on the Keycloak user record (the `manager` attribute, value = the `sub` of the owning user's manager). The Party Service reads it from the token (via a User Attribute mapper) or from Keycloak at enforcement time; it does not read a Serendipity `User.managedBy` field. If the hierarchy were stored in the Party Service, a user-management entity would be needed — but the access-control model uses Keycloak for the user representation, so no Serendipity user entity is required. (See the access-control design document's [Keycloak user attributes](#keycloak-user-attributes-user-representation-not-a-serendipity-table) subsection.)

## Field inventory (as shipped)

Organisation fields as shipped: `name`, `email`, `phoneNumber`, `faxNumber`, `preferredContactMethod`, `establishmentDate`.

Individual fields as shipped: `name` (embedded: title, givenName, preferredName, middleName, familyName, initials, honorific, salutation), `names` (collection of `IndividualName`), `jobTitle`, `sex`, `gender`, `email`, `phoneNumber`, `faxNumber`, `preferredContactMethod`, `photoUrl`, `electorate`, `dateOfBirth`, `placeOfBirth`, `countryOfBirth`, `dateOfDeath`, `placeOfDeath`, `countryOfDeath`.

Party fields as shipped: `publicId`, `type`, `legalEntityType`, `displayName`, `fromDate`, `toDate`, `addresses`, `roles`, `audit` (createdAt, updatedAt, createdBy, updatedBy).

Fields the access-control model will add to `Party`: `ownedBy`, `assignedTo`, `assignedToTeam`, `ownedByManager`.

## Open questions

1. **Where does the owning user's `manager` live?** Decided by the access-control model: the owning user's manager is a Keycloak user attribute (`manager`, value = the `sub` of the owning user's manager), not a Serendipity field. The Party Service has no `User` entity — the user is a Keycloak user, not a Serendipity table row. The Party Service reads the owning user's `manager` from the token (if a User Attribute mapper emits it) or from Keycloak at enforcement time; it does not read a Serendipity `User.managedBy` field. If a convenience field is wanted on the entity, `Party.ownedByManager` mirrors the owning user's `manager` attribute. (The access-control design document's [Keycloak user attributes](#keycloak-user-attributes-user-representation-not-a-serendipity-table) subsection covers the attribute set in full.)
2. **Does `Organisation` need its missing fields?** The overview page lists `description`, `legalEntityType`, `industry`, `website`, `address`, `billingAddress`, and an `Identifier` link. The entity does not have them. Decide whether to add them to the entity (and the update DTO and model) or update the overview page to match the entity.
3. **How is soft delete implemented for `Individual` and `Organisation`?** The subtypes do not have `toDate`; only `Party` does. The `deleteByPartyPublicId` repository methods delete the subtype row. Confirm that the intended soft-delete behavior is to set `Party.toDate` (and possibly delete the subtype row) rather than hard-deleting the subtype row, and that this is consistent with ADR-0002.
4. **Is `electorate` sufficient as free text?** If electorate-based access or grouping is a future requirement, `Individual.electorate` would need to become a link to `ElectoralDivision` (or a new electorate entity). If it stays as free text, that is fine now.
5. **Is `Role.partyName` / `reciprocalPartyName` denormalisation intentional?** The role carries copies of the party's name, email, and phone. If the party's details change, the role does not update. Decide whether this is intentional (snapshot semantics) or whether the role should read from the party at query time.

## What this document does not cover

- The database seeds (Australian political parties, house of representatives, senate, electoral divisions) — described in the Party Service overview.
- The repository interfaces in full — `PartyRepository`, `IndividualRepository`, `OrganisationRepository`, `IndividualNameRepository`, `AddressRepository`, `RoleRepository`, `IdentifierRepository`, `ElectoralDivisionRepository`, `LocationRepository`. The design document assumes they follow Spring Data JPA patterns (`findByPartyPublicId`, `deleteByPartyPublicId`, paginated `findAll`, name search).
- The service-layer orchestration — `IndividualService`, `OrganisationService` — except where it reveals the entity shape (e.g. the update methods copy fields field-by-field, which confirms the entity's mutable fields).
- The controllers and the full API surface — described in the Party Service overview. This document focuses on the entity model.
- The access-control enforcement sketch — that is the access-control design document's concern. This document only notes the gap between the entity model as shipped and the access-control model's field requirements.
