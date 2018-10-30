/**
 * The DTO's for the Core services.
 */

// https://google.github.io/styleguide/jsoncstyleguide.xml

export interface ColumnDef {
  name?: string;
  displayName?: string;
  class?: string;
}

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

// leftToRight?: boolean;
// namePrefix?: string;
// nameSuffix?: string;
// formalSalutation?: string;
// informalSalutation?: string;

// state
// political party
// electorate address line 1 line 2 suburb state post code
// telephone
// fax
// toll free
// label address e.g. GPO BOX 123
// parliamentary title


export interface User {
  uid?: string;
  displayName?: string;
  email?: string;
  // emailVerified?: boolean;
  // isAnonymous?: boolean;
  // metadata
  phoneNumber?: string;
  photoUrl?: string;
  // providerData
  // providerId
  givenName?: string;
  familyName?: string;
}

export interface UserPreferences {
  language?: string;
  email?: string;
}

/*

 organisationName?: string;
  organisationPhone?: string;

// middleName?: string;

export interface Contacts {
  id?: string;
  fullName?: string;
  email?: string;
  organisationName?: string;
  organisationPhone?: string;
}

*/
