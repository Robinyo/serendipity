export class User {

  public id?: string;

  public sub?: string;

  constructor(
    public username: string = '',
    password = '',
    public givenName: string = '',
    public familyName: string = ''
  ) {

    this.password = password;
    this.email = username;
    this.emailVerified = false;
  }

  public password?: string;

  // profile: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate,
  // zoneinfo, locale, and updated_at
  public name?: string;
  // public givenName?: string;
  public middleName?: string;
  // public familyName?: string;
  public nickname?: string;
  public preferredUsername?: string;
  public profile?: string;
  public picture?: string;
  public website?: string;
  public gender?: string;
  public birthdate?: string;
  public zoneinfo?: string;
  public locale?: string;
  public updatedAt?: string;

  // email: email and email_verified
  public email: string;
  public emailVerified: boolean;

  // address: address
  public address?: object;

  // phone: phone_number and phone_number_verified.
  public phoneNumber?: string;
  public phoneNumberVerified?: boolean;

  // [propName: string]: any;

}

// [propName: string]: any;
// What we’re saying is that a User can have any number of properties ...

/*

export interface User {

  sub?: string;

  username?: string;
  password?: string;

  // profile: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate,
  // zoneinfo, locale, and updated_at
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

*/

// [propName: string]: any;
// What we’re saying is that a User can have any number of properties ...
