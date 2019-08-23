// https://google.github.io/styleguide/jsoncstyleguide.xml

import { Address } from './address';
import { Individual } from './individual';
import { Party } from './party';

export * from './address';
export * from './individual';
export * from './party';

export interface ColumnDef {
  name?: string;
  displayName?: string;
  class?: string;
}


// tslint:disable-next-line:no-empty-interface
// export interface Contact extends Individual {}
export class Contact extends Individual {}




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

/*

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

*/

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
