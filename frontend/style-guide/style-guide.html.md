# HTML Template Style Guide

Last updated on 2026-06-06.

This document contains guidelines for _Angular_ view templates (HTML files).

## Do

### Must do

- use [**Angular coding style guide**](https://angular.dev/style-guide)
- use [**Prettier**](https://prettier.io/)
- use [**valid HTML**](https://validator.w3.org/)
- use **strict formatting**
  - use **2 spaces indents** (Prettier)
  - use **`"double quotes"`** rather than single quotes (Prettier)
  - use only **lowercase** for tags and attributes
  - use only necessary html attributes (e.g. no id="", no name="")
- use new **control flow (@if, @for) syntax**
- prefer `[class.name]` and `[style.property]` over `ngClass` and `ngStyle`
- ensure accessibility (a11y) by using semantic HTML tags and ARIA attributes where necessary
- use a stable unique primitive for the `track` expression in `@for` loops (e.g. `track item.id`)

### Should do

- avoid overly complex logic in templates (move into component class, max cyclomatic complexity of 10)
- order of one HTML element's properties by category
  - `*structuralDirectives` (rarely used nowadays)
  - `#templateReferenceVariables` e.g. `<input #inputRef>`
  - `htmlAttributes` e.g. `<input required>`, `id="3"`
  - `[propertyBindings]` e.g. `[id]="3"`, `[attr.colspan]="colspan"`, [style.width.%]="100", [@triggerName]="expression", `bind-id="handleChange()"`
  - `[(twoWayBindings)]` e.g. `[(id)]="id"`, `bindon-id="id"`
  - `(eventHandlers)` e.g. `(idChange)="handleChange()"`, `on-id="handleChange()"`
- name event handlers for what they do, not for the triggering event
- add empty lines between siblings that don't belong together
- use `<!-- comment -->` for comments where really necessary
- use `<!-- section -->` for labeling sections in the template if necessary
- mark todos with `<!-- @ToDo: task description -->`
- v22 allows HTML comments inside an element's opening tag (handy for annotating long attribute lists)
- use `<self-closing-tags />` for components without content
- use `NgOptimizedImage` for static images (not for inline base64)
  - with known dimensions: `ngSrc`, `width`, `height`, `alt`
  - with unknown dimensions: `ngSrc` + `fill` and a parent with non-static `position` and a defined size
- use `Angular Pipes` for formatting
- control flow (`@if`, `@for`)
  - use boolean flags for complex `@if` statements
  - use `@else` and `@empty` to increase readability
  - use `ng-container` if no HTML element is needed
  - use `ng-container` if multiple elements use same `@if`
  - avoid tracking by object identity or `$index`, except for static lists
- use `@let` for template-local values; don't abbreviate the alias – mirror the source signal name
  - when the alias mirrors a signal, read it via `this.` to avoid self-reference (e.g. `@let flight = this.flight()`)
- bind Signal Forms fields with the `FormField` directive (`[formField]="form.fieldName"`); avoid `ngModel` / `formControlName` in new code
- use spaces in string interpolation `{{ example }}`
- use spaces between pipes `{{ example | translate }}`
- use local loading indicators (e.g. spinners) for async data
- it's okay to use service properties and 1-liners directly in the View Template (HTML)
- use `@defer` to lazy load non-critical or heavy parts of the UI
- always specify a `type` attribute on `<button>` elements (e.g., `type="button"`, `type="submit"`)
- use strict equality (`===`) in template expressions

## Don't

- avoid divs and other elements without a reason
- avoid empty lines between siblings that belong together
- avoid functions in HTML templates (except for event handlers), signals don't count
- avoid inline styles (except if computed/dynamic e.g., with [style.--l-row-count])
- avoid hardcoding user-facing strings; prefer translation pipes (e.g., `{{ 'KEY' | translate }}`)

## Resources

- [Prettier](https://prettier.io/)
- [Google HTML Style Guide](https://google.github.io/styleguide/htmlcssguide.html#HTML_Style_Rules)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
