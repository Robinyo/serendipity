# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for Serendipity.

Each ADR captures a significant architectural decision, the context in which it was made, and the consequences of that decision. They are numbered sequentially and are immutable once accepted — if a decision changes, a new ADR supersedes the old one rather than editing it.

## Index

| Number | Title | Status |
|---|---|---|
| [ADR-0001](./adr-0001-bff-oauth2-confidential-client.md) | Backend for Frontend as OAuth 2.0 confidential client | Accepted |
| [ADR-0002](./adr-0002-soft-delete-party-entities.md) | Soft delete for Party entities using `toDate` | Accepted |
| [ADR-0003](./adr-0003-bff-cors-csrf-session-security.md) | BFF CORS, CSRF, and session security model | Accepted |

## About this directory

ADRs live alongside the documentation in the Docusaurus site, under `website/docs/architecture-guide/adr/`. They are rendered as part of the site and linked from the Architecture Guide section of the sidebar.

## ADR format

Each ADR follows a consistent structure:

- **Title** — a short, descriptive name
- **Status** — Proposed, Accepted, Deprecated, or Superseded
- **Context** — the problem, constraints, and alternatives considered
- **Decision** — what was chosen, stated clearly
- **Consequences** — what this makes easier, what it makes harder, and what we need to live with

## Contributing

See [Contributing](../../contributing) for how to propose changes.

ADRs are written close to the time a decision is made. If you are proposing a new architectural decision, open an issue first to discuss the approach — an ADR should record a decision that has been made, not propose one in the abstract.
