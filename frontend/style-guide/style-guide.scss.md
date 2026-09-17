# SCSS Style Guide

Last updated on 2026-06-06.

This document contains guidelines for _Angular_ styling (SCSS) files.

## Do

### Must do

- use [**Prettier**](https://prettier.io/)
- use **SCSS**
- use **strict formatting**
  - use **2 spaces indents** (Prettier)
  - use **`'single quotes'`** (Prettier)
  - use **1 selector per line** (Prettier)
  - use **1 property per line** (Prettier)
  - use **`dash-separated-lowercase`** for selectors
  - use meaningful empty lines to separate code
  - put a blank line (two line breaks) between rules
- use classes or element-names (component selectors), avoid ids
- if `ViewEncapsulation.None` a prefix must be used
  - project specific prefix
  - but not to CSS custom properties
- max 2, in rare cases 3 nested selectors
- use global CSS custom properties for design tokens
- use component-private CSS custom properties on `:host` for component-specific styling knobs
- prefer component-specific styles for component style
- use global styles for global styles only
- use shorthand or intrinsic wherever possible and useful
  - `margin: 1em auto;`
- write zero values without a unit
  - `margin: 0;`
- explicitly write the 0 (Prettier)
  - `margin: 0.5em;`
- use `@use` and `@forward` instead of deprecated `@import`
- use `rem` for typography instead of `px`

### Should do

- write less & simple SCSS
- use [**Stylelint**](https://stylelint.io/) if the project has a Stylelint config
  - separate rules by new lines
  - order properties alphabetically if configured
- use BEM syntax (Block, Element, Modifier)
  - `.md-person {}`
  - `.md-person__head {}`
  - `.md-person--tall {}`
  - there are no nested BEM selectors
- organise global styles by using imports
  - 1.) Variables (breakpoints, colors, sizes)
  - 2.) Libraries and helpers (CDK, Bootstrap)
  - 3.) Fonts
  - 4.) Mixins
  - 5.) Objects
  - 6.) Variants
- prefer CSS logical properties (e.g., `margin-inline-start`) over physical properties (`margin-left`)
- use `:has()` for parent/sibling state styling instead of JS-toggled classes where possible

## Don't

- avoid inline styles - it may become a CSP issue
- avoid `!important` - it's a bad habit, believe me
- avoid using existing library classes - use prefixed classes instead
  - (e.g. don't use `.heading`, `.label` or `.form-control`)
  - only use those classes to override the lib's own CSS
- avoid nesting with more than 2 levels (in rare cases 3)
  - okay: `.md-is-home .md-person`
  - hell no: `body.md-is-home .md-person.md-is-disabled > .md-avatar`
  - use modifier instead: `.md-avatar--disabled`
- avoid defining raw colors in components (use design tokens or component-private custom properties)
- avoid `float` use CSS grid or flexbox instead
  - howto [choose between grid and flexbox](https://medium.com/youstart-labs/beginners-guide-to-choose-between-css-grid-and-flexbox-783005dd2412)
- avoid writing properties which could be shorthanded (e.g., margin)
- avoid `&` to nest styles (for better readability)
- avoid using `::ng-deep` as it is deprecated (use CSS custom properties instead)

## Resources

- [Prettier](https://prettier.io/)
- [Stylelint](https://stylelint.io/)
- [Sass Guidelines](https://sass-guidelin.es/)
- [css { guide: lines; }](https://cssguidelin.es/)
- [CSS Guidelines](https://github.com/chris-pearce/css-guidelines)
- [Google CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html#CSS)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
