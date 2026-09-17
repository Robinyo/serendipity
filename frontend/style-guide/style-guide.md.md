# Markdown Style Guide

Last updated on 2026-06-06.

This document contains guidelines for Markdown files (`.md` / `.mdx`).

## Do

### Must do

- use [**Prettier**](https://prettier.io/)
- use ATX headings (`#`); exactly one `#` H1 per file
- fence code blocks and tag the opening fence with a language (e.g. `ts`, `bash`, `html`)

### Should do

- add TOC (Table of Contents) to long documents
- don't skip heading levels (`#` → `##` → `###`)
- use relative links between docs in this repo
- give images descriptive `alt` text
- mark todos with `<!-- @ToDo: task description -->`

## Don't

- don't use bare URLs — wrap them as `[text](url)`
- avoid raw HTML in Markdown unless necessary

## Resources

- [Prettier](https://prettier.io/)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
