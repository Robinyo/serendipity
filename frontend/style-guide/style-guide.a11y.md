# Accessibility (a11y) Style Guide

Last updated on 2026-06-06.

This document contains accessibility guidelines for _Angular_ apps. Target: **WCAG 2.x AA** with **zero AXE violations**.

## Do

### Must do

- meet WCAG AA minimums (contrast, focus, name/role/value)
- use semantic HTML first; reach for ARIA only when no native element fits
- every form control has a programmatic label (`<label for>`, `aria-label`, or `aria-labelledby`)
- every image has `alt` (empty `alt=""` for decorative)
- all interactive elements are keyboard-reachable and operable, with a visible focus indicator
- text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI components)
- never convey meaning by color alone

### Should do

- manage focus on route change and on dialog open/close
- run AXE checks with `@axe-core/playwright` on key views in e2e (see testing guide)
- trap focus in modal dialogs and restore it to the trigger on close (Angular CDK `cdkTrapFocus`)
- use `<button>` for actions and `<a href>` for navigation (never `div` / `span` with click handlers)
- announce async / live updates with `aria-live` (or CDK `LiveAnnouncer`)
- one `<h1>` per page; don't skip heading levels
- respect `prefers-reduced-motion`
- set `lang` on `<html>`
- prefer Angular Aria / Angular CDK primitives over hand-rolled ARIA widgets

## Don't

- don't use positive `tabindex` values
- don't remove focus outlines without an equally visible replacement
- don't use ARIA to patch markup where a native element exists

## Resources

- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [Angular accessibility guide](https://angular.dev/best-practices/a11y)
- [Angular CDK a11y](https://material.angular.dev/cdk/a11y/overview)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
