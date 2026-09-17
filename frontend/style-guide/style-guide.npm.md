# NPM Packages Style Guide

Last updated on 2026-06-06.

This document contains guidelines for NPM packages.

Before including a third-party package:

## Do

### Must do

- check if a first-party package is available
- check license (e.g. MIT, Apache-2.0, ISC, BSD)
- check vulnerabilities (run `npm audit`)
- use devDependencies for development tools

### Should do

- ensure the package provides TypeScript definitions (either built-in or via `@types/`)
- prefer packages with low dependencies
- make sure package is necessary
- only use maintained packages
- check for better alternatives
- check package size and impact on bundle (e.g., using Bundlephobia)
- prefer Angular packages that support modern features (Standalone components, Zoneless)
- verify compatibility with the project's Angular major (v22), TypeScript 6, and Node 26 (check `peerDependencies` / `engines`)
- prefer packages published with provenance, keep the lockfile committed, and be wary of unvetted `postinstall` scripts

## Don't

- avoid using abandoned packages
- avoid using commercial packages with license fee without approval by project steering
- avoid mixing package managers; use the package manager configured by this workspace (`npm`)
- avoid installing global packages unnecessarily

## Back to index

- [Angular Coding Style Guide](style-guide.md)
