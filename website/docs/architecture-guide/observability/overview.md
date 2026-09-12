# Overview

This section contains the design content for Serendipity's observability — how the platform's running services are made understandable through logs, metrics, and traces.

## Contents

- [Observability Design](./design.md) — the **design document (proposal)**. The guiding principles (instrument once, emit everywhere; OTLP as the export standard; three pillars share an identity; low cardinality in metrics, high cardinality in traces and logs; Actuator as a management surface), the architecture (instrumentation layer, export and collection), the chosen approaches (Micrometer Observation API, OpenTelemetry/OTLP, structured JSON logging, externally controlled log levels), the current state (what the BFF already includes and what it does not), the implementation approach, and the open questions. This doc is a proposal; it has not been accepted as a decision yet. Once a decision is reached, the decision may be recorded as an ADR, and this doc will remain as the background and detail behind it.

## Related

- [ADR index](./adr/overview.md) — once a decision is made on observability, it may be recorded as an ADR.
- [Roadmap](../../roadmap.md) — the implementation tracker for observability work (Phase 2 — Observability).

## Note

This section is a proposal. The design has not been accepted yet, and no implementation work has started. The roadmap items in the [Roadmap](../../roadmap.md) track the work when it is picked up.
