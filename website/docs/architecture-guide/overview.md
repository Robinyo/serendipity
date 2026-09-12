# Overview

This section documents Serendipity's architecture — the design decisions, the design process, and the living design content that guides implementation.

## How we design and decide

Serendipity uses a lightweight, documents-first approach to architectural decisions. We do not formalise the process to the point of bureaucracy, but we do write things down so that decisions are visible, reviewable, and remembered.

### The process

1. **Proposal (design doc).** When an area needs architecture — a new service, a security model, an access-control model, a migration — we write a design doc first. The design doc captures the model, the assumptions, the alternatives considered, and the open questions. It is a proposal, not a decision. Design docs live in the Architecture Guide (under a relevant subcategory) so they can be reviewed and commented on. They are living documents during the proposal phase; they can be revised.

2. **Review and decision.** The proposal is reviewed (by the team, or by the maintainer). If the proposal is accepted, we write an Architecture Decision Record (ADR) that records the decision: what was chosen, the context, the alternatives considered, and the consequences. If the proposal is not accepted, the ADR records that and explains why — or we revise the proposal and try again.

3. **ADR.** Each significant architectural decision gets an ADR. ADRs are numbered sequentially, immutable once accepted, and live in the `ADR` subdirectory of the Architecture Guide. If a decision changes later, a new ADR supersedes the old one — we do not edit accepted ADRs. ADRs are the durable record of what we decided and why.

4. **Roadmap.** Once a decision is recorded, the corresponding workitem goes into the roadmap (as a `⏳` item, moving to `✅` when done). The roadmap item links to the ADR. The roadmap is the implementation tracker; the ADR is the decision record.

5. **Implementation.** The implementation realises the decision. Code, configuration, and any realm or infrastructure changes are the realization. The ADR and roadmap item are updated (or closed) as the implementation progresses.

### Artifacts and where they live

| Artifact | Where | Purpose | Mutable? |
|---|---|---|---|
| Design doc | Architecture Guide subcategory (e.g. `access-control/`) | Proposal, model, assumptions, open questions | Yes, until decision |
| ADR | `architecture-guide/adr/` | Decision record — what we chose and why | No (immutable; superseded by new ADR) |
| Roadmap | `roadmap.md` | Implementation&nbsp;tracker&nbsp;—&nbsp;`⏳`&nbsp;→&nbsp;`✅` | Yes, as work progresses |
| Implementation | Code, config, realm, infrastructure | Realization of the decision | Yes, as code is developed |

### ADR format

Each ADR follows a consistent structure:

- **Title** — a short, descriptive name
- **Status** — Proposed, Accepted, Deprecated, or Superseded
- **Context** — the problem, constraints, and alternatives considered
- **Decision** — what was chosen, stated clearly
- **Consequences** — what this makes easier, what it makes harder, and what we need to live with

See the [ADR index](./adr/overview.md) for the current ADRs and the ADR format in detail.

### Design docs

Design docs capture the thinking behind a proposal before it becomes a decision. A design doc is a **proposal** — it has not been accepted yet. It is the model, the assumptions, and the reasoning presented for review. Once a decision is made, the design doc stays in place as the background and detail behind the ADR; it is not discarded. The ADR is the accepted decision; the design doc is the proposal and the reasoning.

A design doc may be revised in response to review feedback. An ADR does not change once accepted.

### When to write an ADR

An ADR is warranted when the decision is significant — it affects the architecture, the security model, the data model, the deployment model, or the way components interact. Not every design choice needs an ADR; small decisions can be made and recorded in code or in a design doc without an ADR. If you are unsure whether something deserves an ADR, err on the side of writing one — a short ADR is still a record.

### Reviewing and contributing

Design proposals and ADRs are reviewed before they are accepted. If you want to propose a change to the architecture, write a design doc (or sketch the idea) and raise it for review before writing an ADR. An ADR should record a decision that has been made, not propose one in the abstract.

## Contents

- **ADR** — the Architecture Decision Records. The durable record of significant architectural decisions.
- **Access Control** — the design for users, groups, and permissions for Accounts and Contacts. The model, the token design, the enforcement approach, and the open questions.

