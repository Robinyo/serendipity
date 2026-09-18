# Configure

This document describes how the Serendipity Angular workspace is configured at the
TypeScript / build level: the multi-project structure, the tsconfig setup,
path aliases, and the relationship between the PWA application and the library
projects.

## Workspace structure

The Angular workspace is a **multi-project** workspace rooted at `frontend/`.
It contains one application project and six library projects:

| Project | Type | Path | Root / source root | tsconfig |
|---|---|---|---|---|
| `serendipity-pwa` | application | `projects/serendipity-pwa/` | `projects/serendipity-pwa/` / `projects/serendipity-pwa/src/` | `projects/serendipity-pwa/tsconfig.app.json`, `tsconfig.spec.json` |
| `serendipity-utils-lib` | library | `projects/serendipity-utils-lib/` | `projects/serendipity-utils-lib/` / `projects/serendipity-utils-lib/src/` | `projects/serendipity-utils-lib/tsconfig.lib.json`, `tsconfig.spec.json` |
| `serendipity-auth-lib` | library | `projects/serendipity-auth-lib/` | `projects/serendipity-auth-lib/` / `projects/serendipity-auth-lib/src/` | `projects/serendipity-auth-lib/tsconfig.lib.json`, `tsconfig.spec.json` |
| `serendipity-components-lib` | library | `projects/serendipity-components-lib/` | `projects/serendipity-components-lib/` / `projects/serendipity-components-lib/src/` | `projects/serendipity-components-lib/tsconfig.lib.json`, `tsconfig.spec.json` |
| `serendipity-party-lib` | library | `projects/serendipity-party-lib/` | `projects/serendipity-party-lib/` / `projects/serendipity-party-lib/src/` | `projects/serendipity-party-lib/tsconfig.lib.json`, `tsconfig.spec.json` |
| `serendipity-workflow-lib` | library | `projects/serendipity-workflow-lib/` | `projects/serendipity-workflow-lib/` / `projects/serendipity-workflow-lib/src/` | `projects/serendipity-workflow-lib/tsconfig.lib.json`, `tsconfig.spec.json` |
| `serendipity-camunda-lib` | library | `projects/serendipity-camunda-lib/` | `projects/serendipity-camunda-lib/` / `projects/serendipity-camunda-lib/src/` | `projects/serendipity-camunda-lib/tsconfig.lib.json`, `tsconfig.spec.json` |

Each library publishes its public API through a `public-api.ts` barrel at the root
of its `src/` directory (e.g. `projects/serendipity-auth-lib/src/public-api.ts`).
Library consumers import from the library's package name (see path aliases below),
not from the internal file structure.

## TypeScript configuration layers

The workspace uses three layers of TypeScript configuration:

**1. Workspace base — `frontend/tsconfig.json`**

The shared base for every project in the workspace. It sets the strict compiler
options and the path aliases that every project inherits:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve",
    "moduleResolution": "bundler",
    "paths": {
      "serendipity-auth-lib": ["./dist/serendipity-auth-lib"],
      "serendipity-auth-lib/*": ["./dist/serendipity-auth-lib/*"],
      "serendipity-utils-lib": ["./dist/serendipity-utils-lib"],
      "serendipity-utils-lib/*": ["./dist/serendipity-utils-lib/*"],
      "serendipity-components-lib": ["./dist/serendipity-components-lib"],
      "serendipity-components-lib/*": ["./dist/serendipity-components-lib/*"],
      "serendipity-party-lib": ["./dist/serendipity-party-lib"],
      "serendipity-party-lib/*": ["./dist/serendipity-party-lib/*"],
      "serendipity-workflow-lib": ["./dist/serendipity-workflow-lib"],
      "serendipity-workflow-lib/*": ["./dist/serendipity-workflow-lib/*"],
      "serendipity-camunda-lib": ["./dist/serendipity-camunda-lib"],
      "serendipity-camunda-lib/*": ["./dist/serendipity-camunda-lib/*"]
    }
  },
  "references": [
    { "path": "./projects/serendipity-pwa/tsconfig.app.json" },
    { "path": "./projects/serendipity-pwa/tsconfig.spec.json" },
    { "path": "./projects/serendipity-utils-lib/tsconfig.lib.json" },
    { "path": "./projects/serendipity-utils-lib/tsconfig.spec.json" },
    { "path": "./projects/serendipity-components-lib/tsconfig.lib.json" },
    { "path": "./projects/serendipity-components-lib/tsconfig.spec.json" },
    { "path": "./projects/serendipity-party-lib/tsconfig.lib.json" },
    { "path": "./projects/serendipity-party-lib/tsconfig.spec.json" },
    { "path": "./projects/serendipity-workflow-lib/tsconfig.lib.json" },
    { "path": "./projects/serendipity-workflow-lib/tsconfig.spec.json" },
    { "path": "./projects/serendipity-auth-lib/tsconfig.lib.json" },
    { "path": "./projects/serendipity-auth-lib/tsconfig.spec.json" },
    { "path": "./projects/serendipity-camunda-lib/tsconfig.lib.json" },
    { "path": "./projects/serendipity-camunda-lib/tsconfig.spec.json" }
  ]
}
```

The `paths` here point at the **built outputs** under `./dist/`. That is the
correct consumption pattern: the application and the spec builds consume each
library as a compiled package, not as raw source.

The `references` array declares the TypeScript project references. This is the
workspace-level wiring that lets TypeScript (and the Angular build tooling) treat
each project as a separate compilation unit with its own tsconfig.

**2. Application tsconfig — `projects/serendipity-pwa/tsconfig.app.json`**

The tsconfig for the PWA application build (the `ng build serendipity-pwa` target)
and, by extension, `ng serve serendipity-pwa`. It extends the workspace base and
overrides the `paths` to point at the **library source** instead of the built
outputs:

```jsonc
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/app",
    "types": [],
    "module": "es2022",
    "moduleResolution": "bundler",
    "paths": {
      "serendipity-auth-lib": ["../../projects/serendipity-auth-lib/src/public-api.ts"],
      "serendipity-auth-lib/*": ["../../projects/serendipity-auth-lib/src/*"],
      "serendipity-utils-lib": ["../../projects/serendipity-utils-lib/src/public-api.ts"],
      "serendipity-utils-lib/*": ["../../projects/serendipity-utils-lib/src/*"],
      "serendipity-components-lib": ["../../projects/serendipity-components-lib/src/public-api.ts"],
      "serendipity-components-lib/*": ["../../projects/serendipity-components-lib/src/*"],
      "serendipity-party-lib": ["../../projects/serendipity-party-lib/src/public-api.ts"],
      "serendipity-party-lib/*": ["../../projects/serendipity-party-lib/src/*"],
      "serendipity-workflow-lib": ["../../projects/serendipity-workflow-lib/src/public-api.ts"],
      "serendipity-workflow-lib/*": ["../../projects/serendipity-workflow-lib/src/*"],
      "serendipity-camunda-lib": ["../../projects/serendipity-camunda-lib/src/public-api.ts"],
      "serendipity-camunda-lib/*": ["../../projects/serendipity-camunda-lib/src/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"],
  "angularCompilerOptions": {
    "preserveSymlinks": false,
    "extendedDiagnostics": {
      "checks": {
        "nullishCoalescingNotNullable": "suppress",
        "optionalChainNotNullable": "suppress"
      }
    }
  }
}
```

This is a deliberate development-time convenience. See [path aliases](#path-aliases)
below for why it exists and what to watch for.

**3. Library tsconfig — `projects/<lib>/tsconfig.lib.json`**

Each library has its own lib tsconfig (shown here for `serendipity-auth-lib`):

```jsonc
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/lib",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": [],
    "module": "esnext",
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.spec.ts"]
}
```

The libraries are compiled by `ng-packagr` (see [build workflow](#build-workflow)),
which reads this tsconfig and produces a packaged library under `dist/<lib-name>/`.

## Path aliases

The workspace uses TypeScript path aliases so that application and library code can
import across project boundaries using the library package names rather than fragile
relative paths.

**Application code imports libraries by their package name:**

```typescript
// in application code (PWA or library)
import { ConfigService } from 'serendipity-utils-lib';
import { AuthService, AUTH_SERVICE_TOKEN } from 'serendipity-auth-lib';
import { AbstractCollectionService } from 'serendipity-utils-lib';
```

This works because both `frontend/tsconfig.json` (the base) and
`projects/serendipity-pwa/tsconfig.app.json` (the app build) declare the
`serendipity-*` paths. The difference is **what those paths point at**:

| Build | Where the path points | Why |
|---|---|---|
| `ng build serendipity-pwa` (production / CI) | `./dist/<lib>/` (built package) | The app consumes the compiled library, as a real package consumer would |
| `ng serve serendipity-pwa` (development) | `../../projects/<lib>/src/*` (library source) | Convenient dev experience: edits in the library source are picked up by the dev server without rebuilding the library first |

The app build tsconfig (`tsconfig.app.json`) overrides the base `paths` with the
source paths. That is the configuration that `ng serve` uses, and it is also the
configuration IntelliJ's TypeScript language service reads.

## The TS6059 `rootDir` note

When IntelliJ's TypeScript language service reads `tsconfig.app.json`, it resolves
the library imports to the library **source** files (because of the source-path
override). Those source files live under `projects/<lib>/src/`, which is outside
the application's own `src/` tree. TypeScript then infers `rootDir` as the common
ancestor of the application's included source (`projects/serendipity-pwa/`) and
complains that the library source files are outside that root (`TS6059: File ...
is not under 'rootDir'`).

This is expected given the source-path override. It is an inspection-level note in
IntelliJ's TypeScript service, **not a build error**: the Angular build (the same
pipeline used by `ng build` and `ng serve`) resolves the path alias and bundles the
application without enforcing `rootDir` in the same way. If `ng build serendipity-pwa`
(and `ng serve serendipity-pwa`) succeed, the TS6059 is informational only.

If the TS6059 is unwanted noise in IntelliJ, the options are:

- leave it (the build and IDE navigation both work; the warning is harmless);
- suppress or downgrade the TS6059 inspection in IntelliJ's TypeScript settings;
- switch the application tsconfig to use the `./dist/...` base paths (losing the
  live library-source hot-reload convenience until the libraries are rebuilt).

## Build workflow

The build is a two-stage process: the libraries are built first (each into its own
`dist/<lib>/` package), then the application is built (consuming the built
packages via the `./dist/...` paths from the workspace base tsconfig).

**Build everything:**

```bash
cd frontend

# Build the libraries (order matters: utils first, then the libraries that depend on it)
ng build --configuration="development" serendipity-utils-lib && \
ng build --configuration="development" serendipity-auth-lib && \
ng build --configuration="development" serendipity-components-lib && \
ng build --configuration="development" serendipity-camunda-lib && \
ng build --configuration="development" serendipity-party-lib && \
ng build --configuration="development" serendipity-workflow-lib

# Then build the application
ng build --configuration="development" serendipity-pwa
```

The `package.json` scripts encode this:

```json
{
  "scripts": {
    "build": "ng build",
    "build:all-libs": "ng build serendipity-utils-lib && ng build serendipity-auth-lib && ng build serendipity-components-lib && ng build serendipity-camunda-lib && ng build serendipity-party-lib && ng build serendipity-workflow-lib",
    "build:pwa:prod": "npm run build:all-libs && ng build serendipity-pwa --configuration production"
  }
}
```

Use `npm run build:all-libs` to build all libraries, and `npm run build:pwa:prod`
to build the libraries then the production PWA in one step.

**Development server:**

```bash
cd frontend
npx ng serve serendipity-pwa --host 0.0.0.0
```

The dev server uses the source-path aliases from `tsconfig.app.json`, so library
source edits are reflected without a separate library rebuild.

## Library dependency relationships

The libraries are built from the lowest-level foundation up. The known dependency
is that `serendipity-auth-lib` relies on `serendipity-utils-lib`, so the utils
library must be compiled first. Build the libraries in this order:

1. `serendipity-utils-lib` (foundation)
2. `serendipity-auth-lib` (depends on utils)
3. the remaining libraries (`serendipity-components-lib`, `serendipity-camunda-lib`,
   `serendipity-party-lib`, `serendipity-workflow-lib`)
4. `serendipity-pwa` (the application, depends on all libraries)

## Architecture overview

The PWA is a standalone, zoneless Angular application built with Angular 22. See
[Angular overview](overview.md) for the high-level picture and
[Angular quickstart](quickstart.md) for getting started.

The key architectural points relevant to this configuration:

- The PWA is **zoneless** — `provideZonelessChangeDetection()` is in
  `projects/serendipity-pwa/src/app/app.config.ts`.
- The PWA is **standalone** — every component is standalone; there are no NgModules
  in the PWA.
- The PWA uses **signals** — the library APIs are consumed via Angular signals
  (resources, signals, `output()`), not NgModule-based DI.
- The PWA is **OnPush everywhere** — every component, including the root `App`,
  uses `ChangeDetectionStrategy.OnPush`.
- The libraries are **standalone packages** — each is built by `ng-packagr` into a
  packaged Angular library under `dist/<lib>/`, consumed by the PWA via the path
  aliases.

## References

- Angular.dev: [Angular CLI](https://angular.dev/cli)
- Angular.dev: [Angular style guide](https://angular.dev/style-guide)
- Angular.dev: [Multi-project workspace](https://angular.dev/reference/configs/file-structure#multiple-projects)
- Angular.dev: [Multiple project file structure](https://angular.dev/reference/configs/file-structure#multiple-projects)
- Angular.dev: [Path mapping](https://angular.dev/guide/ngmodules/module-vs-ngmodule#path-mapping)
- Angular.dev: [Error NG0203: `inject()` must be called from an injection context](https://angular.dev/errors/NG0203)
- Angular.dev: [Migrate from NgModule to standalone](https://angular.dev/guide/ngmodules/standalone-migration)
