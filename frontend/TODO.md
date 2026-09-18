# PWA Review — Against the Angular Style Guide

**Last updated:** 2026-09-18

Grounded in what's on disk after the signal migration landed
(commit `902ce10c` + `f0cef4da`). Covers the PWA application only
(17 `.ts` files, 5 `.html`, 11 `.scss`) — the six library packages are
not yet surveyed (see "Not yet surveyed" below).

## Alignment with the style guide — now resolved ✅

| Item | Status |
|---|---|
| Standalone components, all `OnPush` (incl. root `App`) | ✅ All four components `OnPush`; no `Eager` anywhere |
| `inject()` over constructor DI | ✅ All components / `app.config` / functional interceptor use `inject()` in valid contexts |
| `output()` over `@Output()` | ✅ `NavigationBar` uses `toggleSidenav = output<void>()` |
| No lifecycle hooks in `Layout`/`NavigationBar`; `Home` constructor-only | ✅ `Layout` has no hooks (rxResource is declarative); `Home` has constructor-only SVG registration |
| `rxResource` for async reads | ✅ Three config reads via `rxResource` with `defaultValue: []` |
| `readonly` on signal properties | ✅ `readonly myWorkRoutes = rxResource(...)` — property readonly, `defaultValue` is mutable `SidenavRoute[]` |
| Standalone + `inject()` in `app.config` `provideAppInitializer` | ✅ `inject(AUTH_SERVICE_TOKEN)` in the initializer factory is a valid injection context |
| `provideZonelessChangeDetection()` | ✅ Already in `app.config` |
| Functional interceptor uses `inject()` in-context | ✅ `httpInterceptor` calls `inject(HttpXsrfTokenExtractor)` at the top of the function body — each invocation is in an injection context |
| Generic `ConfigService.get<T>` | ✅ Typed, no `any` |
| Strict equality in `home.ts` | ✅ `svgIcon.name !== undefined` |
| SCSS `@use` | ✅ `styles.scss` uses `@use` |
| Co-located `*.spec.ts` files | ✅ `home.spec.ts`, `layout.spec.ts`, `navigation-bar.spec.ts` |

## Outstanding — style-guide nits (minor, low-risk)

These are style-guide nits, not blockers. Fix as work proceeds, or leave until
a broader cleanup pass.

### SCSS `!important` and raw colors

- `styles.scss:143,178` — `router-outlet { display: none !important }` and
  `mat-sidenav-content { overflow: hidden !important }`
- `layout.scss:2,4,7` — `.active-nav-route` uses `!important` 3× and raw colors
  (`rgba(63,81,181,0.12)`, `#3f51b5`)
- Style guide: "avoid `!important`"; "avoid defining raw colors in components
  (use design tokens or component-private custom properties)"
- These are layout-highlight overrides; defensible, but worth a note if strict
  compliance is wanted. A future pass could move the highlight colors to CSS
  custom properties on `:host` or a token.

### Missing `type="button"` on buttons

- `navigation-bar.html:3,11,15,19,23` — five `<button>` elements without an
  explicit `type` attribute
- Style guide: "always specify a `type` attribute on `<button>` elements
  (e.g. `type="button"`, `type="submit"`)"
- These buttons aren't inside a `<form>`, so no submission happens in practice,
  but the guide wants the attribute explicit. Adding `type="button"` to each is
  a trivial, safe fix.

### Hardcoded user-facing strings

- `layout.html`, `navigation-bar.html` — "My Work", "Customers", "Sales",
  "Collateral", "Marketing", "Serendipity", "LOGOUT"
- Style guide: "avoid hardcoding user-facing strings; prefer translation pipes
  (e.g. `{{ 'KEY' | translate }}`)"
- The current app has no i18n/translation layer. This is forward-looking, not a
  must-fix — flag for when i18n is added.

### `public logout()` on NavigationBar

- `navigation-bar.ts:35` — `public logout(): void`
- Style guide: "don't use (default) `public` modifier for properties and methods"
- Angular templates can access private members, so `private logout(): void` would
  be more aligned. Very minor.

### Import ordering

- `layout.ts:1-15`, `navigation-bar.ts:1-8` — imports are grouped logically but
  not strictly alphabetical within groups
- Style guide: "sort imports (group and sort named imports alphabetically)"
- Minor; machine-sort-clean would close this (e.g. via `eslint-plugin-import` or
  a prettier/import-sorter config, if one is added).

## Outstanding — design choices (worth flagging; not style-guide violations)

### Empty sidenav section headers

- `layout.html:39,43,47` — three empty `<h3 matSubheader>` headers for
  Sales / Collateral / Marketing
- Not a style-guide violation, but three empty headers render in the sidenav.
- Options: wire them, mark them `<!-- @ToDo: ... -->`, or remove. The guide's
  "mark todos" line applies if they stay as placeholders.

### `track item.id` with optional `id`

- `layout.html:13,28,55` + `sidenav-route.ts` (`id?: string`)
- Style guide: "use a stable unique primitive for the `track` expression
  (e.g. `track item.id`)"
- If a config item ever has no `id`, `track` collapses (all undefined-id items
  become one). Confirm the config JSON always supplies a stable `id`; if not,
  pick a better track expression.

### No loading indicator for the `rxResource` reads

- `layout.html` — when the config is loading, `.value()` returns `[]` (the
  `defaultValue`) and the `@for` renders nothing. No spinner.
- Style guide (Should do): "use local loading indicators (e.g. spinners) for
  async data"
- Optional — a `.isLoading()` check would add one. Currently the nav is just
  empty while loading.

### No error handling for the `rxResource` reads

- `layout.ts` / `layout.html` — if the config fetch errors, `.value()` falls back
  to `[]` (the `defaultValue`) and the nav is silently empty.
- Again a design choice; explicit error handling would be better. Currently the
  `defaultValue: []` makes the error state indistinguishable from "loaded empty."

### Home constructor does SVG registration (a forEach loop)

- `home.ts:34-46` — the constructor runs a `SVG_ICONS.forEach(...)` loop that
  calls `MatIconRegistry.addSvgIcon(...)` for each icon
- Style guide: "keep constructors and lifecycle hooks simple and clean
  (basically only call methods, except one-liners)"
- The SVG registration is more than a one-liner; borderline. Could move to
  `afterNextRender()` or a dedicated method, but icon registration in the
  constructor is a common, defensible pattern. Low priority.

### No `@defer` / `@let` adoption

- `layout.html` — not used anywhere
- Not a violation; the guide lists `@defer` and `@let` as "should do"
  forward-looking items.

## Not yet surveyed — the libraries (genuinely outstanding for a full review)

The review above covers only the PWA application. The six library packages are
still the blind spot for a complete style-guide review:

- **`serendipity-auth-lib`** — auth guard, auth service, token handling; likely
  where `@Injectable`, `@Input`/`@Output` (if any), `any` usage, enum-vs-type,
  and naming conventions live
- **`serendipity-utils-lib`** — `ConfigService` (now reviewed), `LoggerService`,
  `FormsService`, `AbstractCollectionService`, models, adapters; the `any` usage
  and naming-conventions question lives here
- **`serendipity-components-lib`** — shared UI components; likely where
  `@Input`/`@ViewChild`/`@HostBinding`/`@HostListener` and template complexity
  show up
- **`serendipity-party-lib`** — feature lib; where `any`, naming, and
  decorator-vs-signal patterns would show up
- **`serendipity-workflow-lib`** — feature lib; same
- **`serendipity-camunda-lib`** — feature lib; same

A full review of style-guide conformance across the project would need at least a
read of `serendipity-auth-lib` and `serendipity-components-lib` (the two most
likely to carry the decorator / `any` / naming patterns).

## Summary

Nothing blocking, nothing critical outstanding. The signal migration closed the
material items (OnPush everywhere, no subscription leak, `output()` conversion,
`rxResource` for async reads). What's left is:

- a set of minor style-guide nits (SCSS `!important`/raw colors, missing
  `type="button"`, hardcoded strings, `public logout`, import ordering);
- a few design-choice flags (empty sidenav headers, `track item.id` with optional
  id, no loading/error indicators for the resources, Home constructor scope); and
- the libraries, which haven't been surveyed yet.
