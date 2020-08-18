import { Location } from './location';

import { LocationType } from '../types/location-type';

export class Address {

  constructor(
    public location: Location = new Location(LocationType.ADDRESS),
    public name: string = '',
    public line1: string = '',
    public line2: string = '',
    public city: string = '',
    public state: string = '',
    public postalCode: string = '',
    public country: string = '',
    public addressType: string = ''
  ) {
  }

  get id(): string {
    return this.location.id;
  }

}

/*

export class Address {

  constructor(
    public name: string = '',
    public line1: string = '',
    public line2: string = '',
    public city: string = '',
    public state: string = '',
    public postalCode: string = '',
    public country: string = '',
    public addressType: string = ''
  ) {
    this.location = new Location('ADDRESS');
  }

  get id(): string {
    return this.location.id;
  }

  location?: Location;

}

*/

/*

contact: {
  "party": {
    "id": 206,
    "type": "INDIVIDUAL",
    "legalType": "",
    "displayName": "Archer, Mrs Bridget",
    "addresses": [
      {
        "id": 152,
        "location": {
          "id": 152,
          "type": "ADDRESS",
          "displayName": "PO Box 6100 Parliament House Canberra ACT 2600",
          "fromDate": null,
          "toDate": null
        },
        "name": "The Senate",
        "line1": "PO Box 6100",
        "line2": "Parliament House",
        "city": "Canberra",
        "state": "ACT",
        "postalCode": "2600",
        "country": "Australia",
        "addressType": "Mailing"
      },
      {
        "id": 152,
        "location": {
          "id": 152,
          "type": "ADDRESS",
          "displayName": "PO Box 6100 Parliament House Canberra ACT 2600",
          "fromDate": null,
          "toDate": null
        },
        "name": "The Senate",
        "line1": "PO Box 6100",
        "line2": "Parliament House",
        "city": "Canberra",
        "state": "ACT",
        "postalCode": "2600",
        "country": "Australia",
        "addressType": "Mailing"
      }
    ],
    "roles": [
      {
        "id": 207,
        "role": "Member",
        "partyId": 206,
        "partyType": "INDIVIDUAL",
        "partyName": "Archer, Mrs Bridget",
        "partyEmail": "bridget.archer@aph.gov.au",
        "partyPhoneNumber": "",
        "relationship": "Membership",
        "reciprocalRole": "Organisation",
        "reciprocalPartyId": 180,
        "reciprocalPartyType": "ORGANISATION",
        "reciprocalPartyName": "Liberal Party of Australia",
        "reciprocalPartyEmail": "libadm@liberal.org.au",
        "reciprocalPartyPhoneNumber": "(02) 6273 2564"
      },
      {
        "id": 207,
        "role": "Member",
        "partyId": 206,
        "partyType": "INDIVIDUAL",
        "partyName": "Archer, Mrs Bridget",
        "partyEmail": "bridget.archer@aph.gov.au",
        "partyPhoneNumber": "",
        "relationship": "Membership",
        "reciprocalRole": "Organisation",
        "reciprocalPartyId": 180,
        "reciprocalPartyType": "ORGANISATION",
        "reciprocalPartyName": "Liberal Party of Australia",
        "reciprocalPartyEmail": "libadm@liberal.org.au",
        "reciprocalPartyPhoneNumber": "(02) 6273 2564"
      }
    ]
  },
  "name": {
    "title": "Mrs",
    "givenName": "Bridget",
    "preferredGivenName": null,
    "middleName": "Kathleen",
    "familyName": "Archer",
    "preferredFamilyName": null,
    "preferredName": "Bridget",
    "initials": "B. K.",
    "honorific": "MP",
    "salutation": "Mrs"
  },
  "sex": "Female",
  "email": "bridget.archer@aph.gov.au",
  "phoneNumber": "",
  "photoUrl": "http://localhost:3001/photos/archer-bridget.jpg",
  "electorate": "Bass",
  "dateOfBirth": null,
  "placeOfBirth": null,
  "organisation": {
    "id": "MTgw",
    "displayName": "Liberal Party of Australia",
    "email": "libadm@liberal.org.au",
    "phoneNumber": "(02) 6273 2564"
  },
  "id": "MjA2"
}

*/
