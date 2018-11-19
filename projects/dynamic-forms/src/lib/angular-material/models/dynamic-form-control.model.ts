import { ValidatorModel } from './validator.model';

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
