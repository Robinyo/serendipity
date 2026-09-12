# Roadmap

This roadmap outlines where Serendipity is heading and why. It is a living document — items may shift priority as the project evolves and as the community contributes.

The roadmap is organised into phases. Each phase builds on the one before it, but the boundaries are approximate: work can and should be resequenced as circumstances change.

## Vision

A mature, production-ready open-source Customer Engagement Platform that organisations can self-host to connect customers, products, people, and operations — with strong security defaults, extensible workflows, and a contributor-friendly codebase.

## Guiding principles

1. **Documentation and developer experience before features** — a platform nobody can run is a platform nobody uses.
2. **Core CRM before workflow automation** — interaction tracking and segments are the value; Camunda is the engine.
3. **API surface before plugins** — you cannot have a clean extension model without knowing what is exported.
4. **Security and observability are per-phase, not a phase** — each phase should ship with the maturity of the one before.

---

## Phase 1 — Solidify Foundations

**Status:** ✅ Substantially complete

**Goal:** Ship the version you would confidently recommend to a peer organisation.

### Documentation

- ✅ Architecture Decision Records (ADRs) for key choices
  - ✅ ADR-0001: BFF pattern and OAuth 2.0 confidential client
  - ✅ ADR-0002: Soft delete strategy for Party entities
  - ✅ ADR-0003: BFF CORS, CSRF, and session security model
- ✅ README version statement (Angular v22, Spring Boot v4.0.1, Java 25)
- 🔄 Add API reference (OpenAPI / Springdoc) for the core services

### Developer experience

- ✅ CONTRIBUTING.md
- ✅ Issue templates for bugs, feature requests, and doc fixes
- 🔄 One-command local setup (`docker compose up` or a setup script)

### Security posture

- ✅ Audit CORS headers on the BFF (ADR-0003)
- ✅ Remove commented-out legacy config from SecurityConfig.java
- ✅ Keycloak client configuration documented and reproducible — see [Administration Guide: Keycloak](./administration-guide/keycloak.md)
- ✅ Confirm the mkcert / TLS flow works from a cold start
- ✅ Document rate limiting considerations

### Testing

- ⏳ Backend integration tests for party service CRUD and BFF auth flows
- ⏳ Frontend component tests for critical paths (login, account list, contact form)

### Observability

- ⏳ Actuator health endpoints
- ⏳ Structured JSON logging
- ⏳ Basic metrics (request latency, error rate) via Micrometer and Prometheus

### Dependency upgrades

- ⏳ Establish a quarterly upgrade cadence for Angular, Spring Boot, Camunda, and other major dependencies

**Exit criteria:** A new developer can clone, run locally, and make a small PR within an hour. The docs cover setup, architecture, and the main workflows.

---

## Phase 2 — Core CRM Features

**Status:** ⏳ Planned

**Goal:** Make Serendipity useful as a standalone engagement tool, not just infrastructure.

### Interaction tracking

- Log calls, emails, meetings, and notes against parties and accounts
- Timeline view in the PWA showing interactions in date order

### Task and activity management

- Lightweight task list tied to parties — assign, due dates, status
- Distinct from Camunda workflow tasks but visible alongside them

### Segments and lists

- Dynamic and static lists of contacts (by geography, role, date range, custom criteria)
- Foundation for campaign-style engagement

### Import and export

- CSV bulk import for accounts and contacts
- Export for compliance, reporting, or migration

### Search

- Full-text or indexed search across parties, contacts, and notes
- Frontend search bar backed by backend filtering

### Reporting v1

- Basic dashboards: active accounts, recent contacts, open tasks, task backlog by owner
- Read-only, exportable

**Exit criteria:** A user can import a list of 200 contacts, log a few interactions, create a segment, and see a summary report — all through the UI, without direct database access.

---

## Phase 3 — Workflow and Automation

**Status:** ⏳ Planned

**Goal:** Make Camunda integration a first-class feature, not a separate system.

### Process designer in the PWA

- Embed bpmn-js and form-js as editable canvases
- Users can draft and modify simple processes without leaving the app

### Human task integration

- Camunda user tasks appear in the PWA task list — claim, complete, comment
- Integration via the REST API or a Zeebe client

### Process templates

- Pre-built templates for common engagement scenarios:
  - New contact onboarding
  - Follow-up cadence
  - Complaint handling

### Web-based form builder

- form-js editor surfaced in the PWA for building party and contact forms that drive the data model

### Event triggers

- Hooks that start processes on data events (new contact, milestone reached, task overdue)

**Exit criteria:** A user can build a simple "new contact onboarding" process in the PWA, assign it to a team member, and track completion — all within Serendipity.

---

## Phase 4 — Extensibility and Ecosystem

**Status:** ⏳ Planned

**Goal:** Make it feasible for others to build on Serendipity without forking.

### Plugin and extension model

- Well-defined extension points — custom entities, additional UI components, webhook listeners for outbound events

### API-first where it matters

- Public, versioned REST API for the core domain (parties, interactions, tasks)
- So external systems can integrate without going through the BFF

### Multi-tenancy (optional)

- If ISV resale is a goal: schema-per-tenant or discriminator column
- Tenant-scoped UI and tenant-aware data access

### Deployment guides

- Production deployment playbook — Kubernetes manifest or Helm chart
- Backup and restore for PostgreSQL
- Keycloak realm export and import
- TLS certificate renewal procedures

### Community

- Contributor ladder — good first issue labels, PR review expectations, roadmap discussions
- Showcase of use cases and plugins built by others

**Exit criteria:** A third party can integrate their CRM or marketing tool with Serendipity via the API, or extend the data model with a plugin, without touching the core codebase.

---

## Contributing to the roadmap

See [Contributing](https://github.com/Robinyo/serendipity/blob/main/CONTRIBUTING.md) for how to propose changes, pick up issues, and get involved.

The roadmap is driven by what the community needs and what is sustainable to build. If you have a use case that does not fit these phases, open an issue and describe it — that feedback shapes what comes next.
