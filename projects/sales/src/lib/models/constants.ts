// See: variables.scss

/*

// https://github.com/angular/material2/blob/master/src/lib/toolbar/toolbar.scss

$mat-toolbar-height-desktop: 64px !default;
$mat-toolbar-height-mobile: 56px !default;
$mat-toolbar-row-padding: 16px !default;

@media ($mat-xsmall) {
  @include mat-toolbar-height($mat-toolbar-height-mobile);
}

*/

// btoa(0) === 'MA=='

export const ZERO = '/MA==';
export const CONTACTS = 'sales/contacts';

export const MAT_XSMALL = '(max-width: 599px)';

export const FAKE_ITEMS_LENGTH = 16;

// export const TOOLBAR_HEIGHT_DESKTOP = 64;
// export const TOOLBAR_HEIGHT_MOBILE  = 56;

export const NAVIGATION_BAR_HEIGHT_DESKTOP = 64;
export const NAVIGATION_BAR_HEIGHT_MOBILE  = 56;

export const COMMAND_BAR_HEIGHT_DESKTOP = 56;
export const COMMAND_BAR_HEIGHT_MOBILE  = 0;  // 48, fxHide.xs

export const COMMAND_BAR_SIDENAV_WIDTH = 200;

export const VIEW_BAR_HEIGHT_DESKTOP = 96;
export const VIEW_BAR_HEIGHT_MOBILE  = 84;

export const MARGIN_DESKTOP = 32;
export const MARGIN_MOBILE  = 0;

export const ALPHABET: string[] = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

export const CONTACT_COLUMNS_DESKTOP = [ 'party.displayName', 'email', 'organisation.name', 'organisation.phoneNumber', 'id' ];
export const CONTACT_COLUMNS_MOBILE  = [ 'party.displayName', 'id' ];

//
// TODO
//

// top, right, bottom, and left

export const MARGIN = 32;
export const MARGIN_TOP = 32;
export const MARGIN_RIGHT = 32;
export const MARGIN_BOTTOM = 32;
export const MARGIN_LEFT = 32;

/*

export const ALPHABET: string[] = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

*/
