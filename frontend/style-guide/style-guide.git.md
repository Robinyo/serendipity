# Git Style Guide

Last updated on 2026-06-06.

This document contains guidelines for Git usage.

## Do

### Must do

- use [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)
- before committing, run ESLint and Prettier (maybe also in pre-commit hook), and optimise imports
- commit message header should be `type(scope): short description`
- types
  - **a11y**: A code change that improves accessibility
  - **build**: Changes that affect the build system or external dependencies (e.g. updates, npm packages)
  - **chore**: Routine maintenance not touching src/test (deps, config, tooling)
  - **ci**: Changes to our CI configuration files and scripts
  - **docs**: Documentation only changes
  - **feat**: A new feature
  - **fix**: A bug fix
  - **perf**: A code change that improves performance
  - **refactor**: A code change that neither fixes a bug nor adds a feature but improves the code
  - **revert**: Reverts a previous commit
  - **style**: Formatting/whitespace only, no behavior change (not CSS)
  - **test**: Adding missing tests or correcting existing tests
- commit message description can be used to include details
- atomic but reasonable commits
- use **LF endings**, no auto conversion `auto-crlf`

### Should do

## Don't

- don't change branches that have been assigned to a review(er)
- don't amend commits if there are findings in a review, the reviewer must be able to continue his review from the last commit he already reviewed; also no rebasing at this stage

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
