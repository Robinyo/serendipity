# Angular Material SCSS Style Guide

Last updated on 2026-06-06.

This document contains guidelines for working with **Angular Material** (M3) components, themes, and overlays in Angular projects.

## Do

### Must do

- use **[Angular Material 3 (M3)](https://material.angular.io)** design system standards
- use **System CSS Tokens** (`--mat-sys-*`) for styling and color overrides
  - e.g., `color: var(--mat-sys-primary);`
  - e.g., `background-color: var(--mat-sys-surface-container);`
- use **Standalone Imports** for Material modules
  - `imports: [MatButtonModule, MatIconModule, MatFormFieldModule]`
- use `@use '@angular/material' as mat;` at the top of your global theme SCSS file
- use `mat.theme()` to define M3 palettes and typography in global styles
- use `appearance="outline"` for all `<mat-form-field>` components unless specified otherwise
- use `<mat-error>` inside every `<mat-form-field>` bound to Reactive Forms
- include `aria-label` or `aria-labelledby` on `mat-icon` buttons or standalone visual elements
- use `MatDialog` and `MatSnackBar` configuration objects (`MatDialogConfig`) for positioning and dimensions instead of global CSS overrides
- use Angular Material **Component Harnesses** for unit and integration testing
  - `import { MatButtonHarness } from '@angular/material/button/testing';`

### Should do

- prefer component-level M3 overrides over global style pollution
- use `mat.card-overrides()` or component-specific Sass mixins when customizing M3 density and structural tokens
- use `OverlayModule` from `@angular/cdk/overlay` for custom floating panels or popovers
- use `CdkVirtualScrollViewport` for large lists rendering Material components to ensure high performance
- group form controls inside `<mat-form-field>` with explicit `<mat-label>` definitions
- use `mat-typography` utility classes (`mat-headline-medium`, `mat-body-large`) for text elements inside Material components
- configure default options at the root level using provider tokens
  - e.g., `provideMaterialDefaultOptions({ ... })` or `MAT_FORM_FIELD_DEFAULT_OPTIONS`

## Don't

- avoid using deprecated `@import '@angular/material/prebuilt-themes/...';` in production applications
- avoid overriding internal Material CSS classes directly
  - hell no: `.mat-mdc-button .mdc-button__label { color: red; }`
  - okay: `--mat-button-label-text-color: red;` or `--mat-sys-primary: red;`
- avoid using `::ng-deep` to force style changes on Material components (use M3 CSS tokens or mixins instead)
- avoid hardcoding hex colors or fixed pixel dimensions inside Material component styles
- avoid using `BrowserAnimationsModule` inside standalone components—use `provideAnimations()` or `provideNoopAnimations()` in `app.config.ts`
- avoid wrapping non-form components inside `<mat-form-field>`
- avoid removing focus indicators (`outline: none` or `::focus-visible`) from interactive Material elements
- avoid inline style bindings on Material components (`[style.color]="'blue'"`)

## Resources

- [Angular Material 3 (M3)](https://material.angular.io)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
