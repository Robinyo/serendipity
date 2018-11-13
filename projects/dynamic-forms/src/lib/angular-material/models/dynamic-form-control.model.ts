import { ValidatorModel } from './validator.model';

export interface DynamicFormControlModel {

  // input, ...

  type?: string;          // 'input'
  id?: string;
  name?: string;          // name || id
  label?: string;
  placeholder?: string;
  autocomplete?: string;  // aka autoFill

  validators?: ValidatorModel[];

  // mat-form-field

  appearance?: string;
  class?: string;

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
