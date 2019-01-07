import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidatorModel } from './validator.model';

export interface DynamicFormControlCustomEvent {

  type: string;                    // 'click' string
  id: string;                      // 'organisation.name'
  directive: string;               // 'matSuffix'
  name: string;                    // 'search'

}

export interface DynamicFormControl {

  formGroup: FormGroup;
  model: DynamicFormControlModel;

  customEvent?: EventEmitter<any>;

}

export interface DynamicFormControlModelConfig {

  // Mandatory items

  type: string;                    // "input"
  id: string;                      // "givenName"

  inputType?: string;              // "text"

  // Optional items

  appearance?: string;             // "outline"
  autocomplete?: string;           // aka autoFill
  gridItemClass?: string;          // "grid-column-1"
  hideRequiredMarker?: boolean;    // false
  label?: string;                  // "Given Name"
  name?: string;                   // "givenName"
  placeholder?: string;            // "Given Name"
  prefixIconName?: string;
  required?: boolean;              // false
  suffixIconName?: string;

  validators?: ValidatorModel[];

}

export class DynamicFormControlModel {

  // Mandatory items

  type: string;                    // "input"
  id: string;                      // "givenName"

  inputType: string;               // "text"

  // Optional items

  appearance?: string;             // "outline"
  autocomplete?: string;           // aka autoFill
  gridItemClass?: string;          // "grid-column-1"
  hideRequiredMarker?: boolean;    // false
  label?: string;                  // "Given Name"
  name?: string;                   // "givenName"
  placeholder?: string;            // "Given Name"
  prefixIconName?: string;
  required?: boolean;              // false
  suffixIconName?: string;

  validators?: ValidatorModel[];

  public constructor(config: DynamicFormControlModelConfig) {

    this.type = config.type;
    this.id = config.id;

    this.inputType = config.inputType || 'text';

    this.appearance = config.appearance || 'outline';
    this.autocomplete = config.autocomplete || null;
    this.gridItemClass = config.gridItemClass || null;
    this.hideRequiredMarker = config.hideRequiredMarker || false;
    this.label = config.label || null;
    this.name = config.name || config.id;
    this.placeholder = config.placeholder || config.label;
    this.prefixIconName = config.prefixIconName || null;
    this.required = config.required || false;
    this.suffixIconName = config.suffixIconName || null;

    this.validators = config.validators || null;

  }

}

/*

color
date
datetime-local
email
month
number
password
search
tel
text
time
url
week

  type: string;           // "input"
  id: string;             // "organisation.phoneNumber"

  // Control Container i.e., mat-form-field

  appearance?: string;
  gridItemClass?: string;

  // Label i.e., mat-label

  label?: string;

  // Control i.e., input, select, ...
  // type?: string;       // 'input'

  autocomplete?: string;  // aka autoFill

  name?: string;          // name || id
  // placeholder?: string;
  required?: boolean;
  // hideRequiredMarker?: boolean;

  validators?: ValidatorModel[];

*/

/*

export interface DynamicFormControlModel {

  // Container i.e., mat-form-field

  appearance?: string;
  class?: string;

  // Label i.e., mat-label

  label?: string;

  // Control i.e., input, select, ...

  type?: string;          // 'input'
  autocomplete?: string;  // aka autoFill
  id?: string;
  name?: string;          // name || id
  placeholder?: string;
  required?: boolean;
  hideRequiredMarker?: boolean;

  validators?: ValidatorModel[];

  // config {}            // aka attributes ???
  // options {}

}

*/

// Reactive form validation -> https://angular.io/guide/form-validation#validator-functions

// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform

// https://nealbuerger.com/2018/04/html-how-to-control-the-form-autofill-autocompetion/
// https://developers.google.com/web/fundamentals/design-and-ux/input/forms/
// https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill

/*

export interface Contact {

  id?: string;
  displayName?: string;
  title?: string;
  givenName?: string;
  middleName?: string;     // otherNames
  familyName?: string;
  honorific?: string;
  salutation?: string;     // formalSalutation
  preferredName?: string;  // informalSalutation
  initials?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  photoUrl?: string;

  'organisation': {
    id?: string;
    name?: string;
    phoneNumber?: string;
  };

}

*/
