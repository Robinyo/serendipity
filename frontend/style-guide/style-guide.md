# Angular Coding Style Guide

Version 2.0.1, last updated on 2026-06-23.

This document contains a general style guide for Angular projects.

It can be used by human developers as well as AI agents.

This guide targets **Angular v22+**, **TypeScript 6**, **Node 26**, a **zoneless** app, and **Vitest + Playwright** for tests.

There are specific style guides for:

- [Accessibility (a11y)](style-guide.a11y.md)
- [Git Commits](style-guide.git.md)
- [HTML View Templates](style-guide.html.md)
- [Markdown Files](style-guide.md.md)
- [NPM Packages](style-guide.npm.md)
- [SCSS Styling Files](style-guide.scss.md)
- [Testing (Vitest & Playwright)](style-guide.spec.md)
- [TypeScript (Angular) Files](style-guide.ts.md)

## Do

### Must do

- run [**Prettier**](https://prettier.io/) on save and before committing
  - use config from `/.prettierrc.json`
  - use for these endings: {css,html,js,json,md,scss,ts}
- use **LF endings**
- use **UTF-8** (no BOM)

### Should do

- Be consistent
- Human-in-the-loop
- KISS (Keep It Short & Simple)
- Prefer small, clear duplication over premature abstraction. Don't force abstraction in every case.

## Don't

- Don't commit AI slop. Always review and edit AI-generated code before committing it!

## Resources

- [Prettier](https://prettier.io/)
