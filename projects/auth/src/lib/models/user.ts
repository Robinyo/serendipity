// https://www.typescriptlang.org/docs/handbook/interfaces.html

// One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing”
// or “structural subtyping”. In TypeScript, interfaces fill the role of naming these types, and are a powerful way of defining contracts
// within your code as well as contracts with code outside of your project.

export interface User {

  sub?: string;

  username?: string;
  password?: string;

  // profile: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate,
  // zoneinfo, locale, and updated_at.
  name?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  nickname?: string;
  preferredUsername?: string;
  profile?: string;
  picture?: string;
  website?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  updatedAt?: string;

  // email: email and email_verified.
  email?: string;
  emailVerified?: boolean;

  // address: address
  address?: object;

  // phone: phone_number and phone_number_verified.
  phoneNumber?: string;
  phoneNumberVerified?: boolean;

  [propName: string]: any;

}

// [propName: string]: any;
// What we’re saying is that a User can have any number of properties ...
