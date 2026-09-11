# ADR-0002: Soft delete for Party entities using `toDate`

**Status:** Accepted

**Date:** 2026-09-11

**Context**

Serendipity's Party entity (and derived entities such as Individual and Organisation) represents customers, contacts, and accounts — data that is entered over time, may be corrected, and may need to be removed without destroying history.

We considered two approaches:

1. **Hard delete** — removing a Party row when the user deletes it. Simple to implement, but destroys audit history, breaks referential integrity for any related data (addresses, roles, interactions, tasks), and makes recovery from accidental deletion difficult.

2. **Soft delete with `toDate`** — marking a Party as deleted by setting a `toDate` value, and filtering out soft-deleted rows in queries using a Hibernate `@SQLRestriction` clause. The row remains in the database, related data stays intact, and the record can be inspected or restored.

**Decision**

We will use **soft delete** for Party entities. A Party is considered active when `toDate` is null; a Party with a non-null `toDate` is considered deleted as of that date.

The `Party` entity is annotated with:

```java
@SQLRestriction("to_date IS NULL OR to_date > CURRENT_DATE")
```

This ensures that Hibernate filters out soft-deleted rows in all queries by default, without requiring applications to remember to add the condition.

**Consequences**

*Positive*

- Audit history is preserved — we know a party existed and when it was deleted
- Related data (addresses, roles, interactions, tasks) remains referentially intact
- Accidental deletions can be inspected and, if appropriate, reversed by clearing `toDate`
- The filtering is applied at the Hibernate level, so application code does not need to remember to add the condition

*Negative*

- Deleted parties still occupy space in the database — a separate data retention policy would be needed to archive or purge old rows
- Queries that bypass Hibernate (raw SQL, reporting tools, direct database access) must remember to apply the same filter
- The `toDate` semantics need to be documented — it represents "deleted as of this date", not "scheduled for deletion"
- Restoring a party by clearing `toDate` is possible but does not automatically restore any related data that may have been removed in the meantime

*Notes*

- This decision applies to the `Party` entity. Whether derived entities (Individual, Organisation) inherit the same pattern is an implementation detail driven by the same reasoning
- If a party is soft-deleted and then re-used (e.g. the same entity re-opened), the `displayName`, `legalEntityType`, and other fields remain as they were at deletion time — they are not automatically cleared
- A future ADR may address data retention and archival if soft-deleted rows accumulate over time
