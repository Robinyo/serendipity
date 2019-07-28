export interface User {

  // sub?: string;

  // profile: name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate,
  // zoneinfo, locale, and updated_at.
  name?: string;
  family_name?: string;
  given_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  updated_at?: string;

  // email: email and email_verified.
  email?: string;
  email_verified?: boolean;

  // address: address
  address?: object;

  // phone: phone_number and phone_number_verified.
  phone_number?: string;
  phone_number_verified?: boolean;

}

/*

export interface User {

  // id?: string;
  username: string;
  password: string;
  givenName?: string;          // firstName
  familyName?: string;         // lastName
  displayName?: string;
  // url?: string;
  email?: string;
  photoUrl?: string;           // pictureUrl

}

{
    "data": [
        {
            "id": "admin",
            "firstName": "Test",
            "lastName": "Administrator",
            "displayName": null,
            "url": "http://localhost:8080/flowable-task/process-api/identity/users/admin",
            "email": "admin@flowable.org",
            "pictureUrl": null
        }
    ],
    "total": 1,
    "start": 0,
    "sort": "id",
    "order": "asc",
    "size": 1
}

*/

// https://openid.net/specs/openid-connect-basic-1_0.html

/*

profile: This scope value requests access to the End-User's default profile Claims, which are: name, family_name, given_name, middle_name,
         nickname, preferred_username, profile, picture, website, gender, birthdate, zoneinfo, locale, and updated_at.
email:   This scope value requests access to the email and email_verified Claims.
address: This scope value requests access to the address Claim.
phone:   This scope value requests access to the phone_number and phone_number_verified Claims.

*/

// https://auth0.com/docs/scopes/current/oidc-scopes
