# Testing Style Guide

Last updated on 2026-06-06.

This document contains guidelines for testing _Angular_ apps with **Vitest** (unit) and **Playwright** (e2e).

## Unit tests (Vitest)

### Must do

- name unit specs `*.spec.ts`, co-located with the unit under test
- use `TestBed`; keep setup minimal
- test public behavior, not private implementation details
- use `provideZonelessChangeDetection()` in test setup (zoneless app)

### Should do

- assert signals/`computed()` via their public outputs
- for OnPush, assert after `fixture.detectChanges()`
- mock dependencies via `TestBed` providers
- keep tests fast, isolated, deterministic (no real HTTP, no real timers)
- one behavior per `it`; descriptive `describe` / `it` names

## E2E tests (Playwright)

### Must do

- locate elements by role / label / text, not brittle CSS or XPath
- assert with web-first `expect` (auto-waiting); avoid fixed `waitForTimeout`

### Should do

- keep tests independent; reset state between tests
- run accessibility checks with `@axe-core/playwright` on key views (see a11y guide)
- use fixtures / page objects for shared flows

## Don't

- don't test framework internals or third-party libraries
- don't rely on test execution order
- don't leave `.only` / `.skip` committed

## Resources

- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Angular testing guide](https://angular.dev/guide/testing)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
