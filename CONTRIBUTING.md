# Contributing to Serendipity

Thank you for your interest in contributing to Serendipity. 

This document covers how to get started, how to propose changes, and what we look for in contributions.

## Getting started

1. Clone the repository.
2. Follow the steps in the [Get Started guide](https://robinyo.github.io/serendipity/docs/get-started/overview) to set up your local environment.
3. Build the frontend and backend and confirm you can run the application locally.

If anything in the setup is unclear or does not work as documented, that is itself a valuable contribution — please open an issue and describe what you hit.

## Reporting issues

Open an issue in the repository. Include:

- What you were trying to do
- What you expected to happen
- What actually happened
- Your environment (operating system, Node.js version, Java version, etc.) where relevant

For actionable issues, include steps to reproduce. For feature ideas, describe the problem you want to solve, not just the solution you have in mind.

## Proposing changes

For small changes — documentation fixes, typo corrections, minor improvements — a pull request is usually enough. No need to ask first.

For larger changes — new features, significant refactors, changes to the public API or architecture — open an issue first to discuss the approach. This avoids wasted effort and helps keep the roadmap coherent.

## Pull requests

- Keep changes focused and self-contained where possible.
- Include tests for new behaviour where appropriate.
- Update relevant documentation if the change affects how something works or how it is set up.
- Ensure the build passes locally before requesting review.

## Code style

- Backend: follow the conventions already present in the Spring Boot modules (formatting, naming, layered structure).
- Frontend: follow the conventions in the Angular workspace (standalone components, lazy loading, library boundaries).
- Documentation: write in Markdown, prefer clarity over length, and keep the Docusaurus site buildable.

## Areas we would welcome help with

The [Roadmap](https://robinyo.github.io/serendipity/docs/roadmap) describes where the project is heading. In the short term, contributions in these areas are especially useful:

- Improving documentation coverage and clarity
- Strengthening tests for existing functionality
- Fixing bugs and removing friction from the local setup
- Small, well-scoped features that move a roadmap item forward

## License

Contributions are made under the terms of the GNU Affero General Public License v3.0, as set out in the repository [LICENSE](../LICENSE).
