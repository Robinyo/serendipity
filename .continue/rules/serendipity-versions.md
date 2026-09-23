# Serendipity Project — Version-Specific Rules

**Purpose:** Give local models (Qwen 2.5 Coder, ~2024 training) enough version context to avoid giving outdated answers for this project's stack.

**Primary model:** Solar Pro 4 (via Hermes on the MacBook Air) — 2026-02 knowledge cutoff, already knows Spring Boot 4, Angular v22, and Java 25. Use this model for version-specific questions.

**Local model:** Qwen 2.5 Coder 7B/14B on the Mac Mini (Ollama at `http://192.168.2.1:11434`) — use for general code structure, refactoring, and code review. Not reliable for version-specific APIs.

---

## Project Stack (grounded in actual project files)

| Layer | Version | Evidence |
|---|---|---|
| Angular | **22.1.1** | `frontend/package.json`: `@angular/core: ^22.1.1` |
| Angular Material | **22.1.1** | `frontend/package.json` |
| Spring Boot | **4.0.1** | `backend/pom.xml` (parent version) |
| Spring Cloud | **2025.1.0** | `backend/pom.xml` (dependency management) |
| Java | **25** | `backend/pom.xml` (java.version property) |
| Keycloak | ~25+ (OIDC/OAuth2) | `backend/modules/web-bff/src/main/resources/application.yml` |
| BFF | Spring Cloud Gateway (WebMVC) | `application.yml`: `spring.cloud.gateway.server.webmvc.routes` |

---

## Angular v22 — Key Points (project-grounded)

### What the project actually uses

- **Standalone components** — no NgModules. All components are `standalone: true` (the default in v22).
- **Zoneless change detection** — `provideZonelessChangeDetection()` in `app.config.ts`. No `NgZone`.
- **OnPush** — every component uses `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Signals** — `signal()`, `computed()`, `effect()` for reactive state.
- **`input()` / `output()`** — functional equivalents of `@Input()` / `@Output()`.
  - `input<T>()` returns a signal; supports `input.required()`, `input.default()`.
  - `output<T>()` returns `OutputEmitterRef<T>` with an `.emit()` method. **Not callable as a bare function.**
- **`provideHttpClient`** with `withInterceptors()` and `withXsrfConfiguration()`.
- **`provideRouter`** with `withComponentInputBinding()`.
- **`inject()`** for dependency injection in field initializers (not just constructors).
- **`firstValueFrom()`** from `rxjs` — used to convert observables to promises (e.g. in `provideAppInitializer`).
- **`rxResource`** — reactive resource for async state (from Angular v22).

### Control flow (Angular v22 built-in)

```html
<!-- Replace *ngFor / *ngIf / *ngSwitch -->
@for (item of items; track item.id) {
  {{ item.name }}
} @empty {
  <p>No items</p>
}

@if (condition) {
  <span>shown</span>
} @else if (other) {
  <span>other</span>
} @else {
  <span>fallback</span>
}

@switch (value) {
  @case (1) { ... }
  @default { ... }
}
```

### What NOT to do (common outdated answers)

- **Don't generate NgModules** — the project uses standalone components exclusively.
- **Don't suggest `NgZone.run()`** — the project is zoneless.
- **Don't suggest `*ngFor` / `*ngIf`** — use `@for` / `@if`.
- **Don't suggest `@Input()` / `@Output()` decorators** — use `input()` / `output()`.
- **Don't call `output()` as a function in templates** — `output<void>()` returns an `OutputEmitterRef`; the correct template binding is `(click)="myOutput.emit()"`, not `(click)="myOutput()"`. (The project has a TS2349 issue around this — see `projects/serendipity-pwa/src/app/features/navigation-bar/`.)

### Signals vs RxJS

- Signals are the primary reactive primitive in v22.
- RxJS is still used where appropriate (e.g. HTTP requests, `firstValueFrom` for one-shot async).
- `toSignal(observable)` converts an observable to a signal.
- `rxResource` bridges signals and async data.

---

## Spring Boot 4.0.1 — Key Points

### What the project actually uses

- **Spring Boot 4.0.1** with **Spring Cloud 2025.1.0**.
- **Spring Cloud Gateway** with **WebMVC** routes (`spring.cloud.gateway.server.webmvc.routes`).
- **OAuth2 client** via `spring.security.oauth2.client.registration.keycloak`.
- **OIDC provider** via `spring.security.oauth2.client.provider.keycloak`.
- **Keycloak issuer:** `https://serendipity-identity-service.localhost/realms/serendipity-dev`.
- **Client ID:** `serendipity-web-bff`.
- **`user-name-attribute: username`** — the BFF reads the `username` attribute (one of Keycloak's four default managed attributes: `username`, `email`, `firstName`, `lastName`) to identify the authenticated user. This is consistent with the project's `.knowledge/backend/security.md` guidance.
- **Scopes:** `openid`, `profile`, `email`.
- **Grant type:** `authorization_code` with PKCE (implied).
- **`server.forward-headers-strategy: framework`** — for proxied/deployed deployments.
- **`spring.main.banner-mode: off`** — suppress the Spring banner.
- **Actuator endpoints:** `beans, env, health, info, metrics` exposed via `management.endpoints.web.exposure.include`.

### Two-token model (Keycloak + BFF)

- **Access token** — forwarded by the BFF to backend services.
- **ID token** — carries user profile attributes (`username`, `email`, `firstName`, `lastName`).
- **`sub`** — Keycloak-assigned UUID, stable identifier, used for ownership/assignment comparisons.
- **`manager` attribute** — custom Keycloak user attribute whose value is the manager's `sub` (a UUID). Set via LDAP federation import-time resolution (Option A: read the direct report's `manager` LDAP DN, look up the user whose LDAP DN matches, read that user's `description` attribute which holds the pre-computed KC `sub`, write that UUID into the direct report's Keycloak `manager` attribute).

### BFF pattern

- Angular PWA (`serendipity-pwa`) → **BFF** (`web-bff`, Spring Cloud Gateway) → backend services (party-service, orchestration, etc.).
- The BFF handles OAuth2 login, token relay, and routing to backend services.
- Backend services trust the BFF as the security boundary (ADR-0004).

### What NOT to do

- **Don't suggest Spring Boot 3.x configuration** — Boot 4 may have changed auto-configuration, property namespaces, or dependency management.
- **Don't suggest `javax.*`** — the project uses `jakarta.*` (already in Boot 3, continued in Boot 4).
- **Don't assume Boot 3.x security config is identical** — verify against Boot 4 docs.
- **Don't confuse the `manager` LDAP attribute (LDAP DN) with the `manager` Keycloak attribute (Keycloak `sub` UUID)** — they are different things resolved at import time.

---

## Java 25 — Key Points

### Baseline and key features

- **Java 25** is the project's baseline (released September 2025).
- **Virtual threads** — standard since Java 21 (`java.lang.Thread.startVirtualThread`, `Executors.newVirtualThreadPerTaskExecutor`).
- **Pattern matching for switch** — standard since Java 21.
- **Record patterns** — standard since Java 21.
- **Sequenced collections** — `SequencedCollection`, `SequencedSet`, `SequencedMap` (Java 21).
- **Scoped values** — `ScopedValue` (JEP 485). Check whether final or still incubating in Java 25. If final, this is the recommended replacement for `ThreadLocal` in many cases.
- **Unnamed variables & patterns** — `_` for unused variables (Java 21+).
- **String templates** — JEP 430. Check status in Java 25 (was incubating).

### What NOT to do

- **Don't suggest `ThreadLocal` as the default** — scoped values may be the preferred approach in Java 25 if final.
- **Don't write Java 17/21 code that uses patterns inconsistently** — pattern matching is standard.
- **Don't confuse Java 25 features with incubator features from earlier versions.**

---

## Serendipity-Specific Patterns

### Security model

- **Keycloak** provides authentication and authorization.
- **Two-token model:** access token (forwarded to services) + ID token (user profile).
- **Roles:** realm roles assigned to users. The frontend gets a BFF-supplied view of roles (the `roles?: string[]` concept in the PWA — a BFF-supplied field, not a Keycloak user attribute).
- **`manager` attribute:** custom Keycloak user attribute = manager's `sub` (UUID). Read by the enforcement layer for manager hierarchy access.
- **`directoryObjectId`:** optional custom attribute = Entra ID Object ID (only relevant when federating with Microsoft Entra ID).

### Project knowledge layer

- The `.knowledge/` directory in the repo root is the canonical project knowledge layer.
- Key files:
  - `.knowledge/index.md` — global monorepo map.
  - `.knowledge/log.md` — ADR log (ADR-0001 through ADR-0005).
  - `.knowledge/backend/index.md` — Spring Boot backend architecture.
  - `.knowledge/backend/security.md` — security model (Keycloak, two-token, roles, `manager` attribute, enforcement).
  - `.knowledge/frontend/index.md` — Angular PWA + BFF flow + token relay.
  - `.knowledge/integration/api-contracts.md` — API contract layer.

### Role tiers (Serendipity)

| Tier | Keycloak role | Example users |
|---|---|---|
| `partner` | Co-owner / senior executive | James Farrell (CEO) |
| `senior-manager` | Senior practice leader | Lee Wolf, Leonard Ansen |
| `manager` | Day-to-day project leader | Max Lubin, Wendy Foley |
| `consultant` | Mid-level professional | Declan McConnachie, Sirkka Nieminen, Michelle Hauptmann, Hudson Talbot, Hannah Burgess |
| `analyst` | Entry-level practitioner | Chas Ewell, Hilary Rollinger |

### Sample organisation

- **Shane Longman** — fictional political lobbying firm (from *Capital City* TV series character names).
- All users are Canberra-based (`l: Canberra`, `st: ACT`), single `shane-longman.org` email domain.
- Sample LDIF: `backend/services/openldap/ldif/shane-longman-v3.1.ldif`.
- Customers: Australian political parties seeded in the Party Service (`backend/modules/party-service/src/main/resources/sample-data/`).

---

## Known Tensions / Things to Verify

1. **Resolved — `username` is the `user-name-attribute`.** The BFF's `application.yml` uses `user-name-attribute: username` (line 55), matching the project's `.knowledge/backend/security.md` guidance. The `username` attribute is one of Keycloak's four default managed attributes (`username`, `email`, `firstName`, `lastName`) and is the attribute the BFF reads to identify the authenticated user. (Previously there was a tension where `application.yml` used `preferred_username`; that has been fixed.)

2. **Spring Boot 4 migration details** — The exact changes from Boot 3.x to Boot 4.x (auto-configuration, property namespaces, dependency management, native image) should be verified against the official Spring Boot 4 migration guide. This rules file does not claim exhaustive knowledge of Boot 4's breaking changes.

3. **Java 25 scoped values status** — Confirm whether `ScopedValue` is final or still incubating in Java 25 before recommending it over `ThreadLocal`.

4. **Angular v22 control flow / signal APIs** — The project uses `@for`, `@if`, `input()`, `output()`, `provideZonelessChangeDetection()`, `rxResource`. If an API has changed between v22.0 and v22.1, verify against the Angular v22.1 changelog.

---

## When to use which model

| Question type | Model |
|---|---|
| "What's the Spring Boot 4 way to configure X?" | **Solar Pro 4 (Hermes)** — knows Boot 4 |
| "How do I write Angular v22 standalone component with signals?" | **Solar Pro 4 (Hermes)** — knows v22 |
| "Does this Java 25 code look right?" | **Solar Pro 4 (Hermes)** — knows Java 25 |
| "Refactor this TypeScript function" | **Qwen 2.5 Coder (Mini)** — fine for structure |
| "Review this Java code for style/issues" | **Qwen 2.5 Coder (Mini)** — fine for review |
| "Write a boilerplate Spring controller" | **Solar Pro 4 (Hermes)** — version-aware |
| "Explain this code to me" | **Either** — Qwen for fast, Solar for version context |
