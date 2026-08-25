import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from './party.js';

import { ContactModel } from '../models/contact.js';
import { OrganisationRefModel } from '../models/organisation-ref.js';

const CONTACT = "Contact";
const ACCOUNT = "Account";

@Injectable({
  providedIn: 'root'
})
export class ContactAdapter extends PartyAdapter implements Adapter<ContactModel> {

  constructor() {
    super();
  }

  adapt(item: any): any {

    this.logger.info('Item: ' + JSON.stringify(item, null, 2));

    // 1. Instantiate a new OrganisationRefModel instance (or default to empty strings)
    let organisation = new OrganisationRefModel('', '', '', '');

    // 2. Extract organisation properties from roles cleanly using .find()
    const accountRole = item.party?.roles?.find(
      (role: any) => role.role === CONTACT && role.reciprocalRole === ACCOUNT
    );

    if (accountRole) {

      this.logger.info('role.role === CONTACT && role.reciprocalRole === ACCOUNT');

      organisation = new OrganisationRefModel(
        accountRole.reciprocalPartyId ?? '',
        accountRole.reciprocalPartyName ?? '',
        accountRole.reciprocalPartyEmail ?? '',
        accountRole.reciprocalPartyPhoneNumber ?? ''
      );

    }

    // 3. Extract primary address with null-safety
    const primaryAddress = item.party?.addresses?.[0] ?? null;

    // 4. Compute photo URL
    const photoUrl = item.photoUrl?.includes('avatar.svg')
      ? 'assets/' + item.photoUrl
      : this.getUrlPrefix() + (item.photoUrl || '');

    // 5. Build summary Contact payload
    const contact: any = {
      ...item,
      photoUrl,
      address: primaryAddress,
      organisation
    };

    this.logger.info('Adapted item: ' + JSON.stringify(contact, null, 2));

    return contact;
  }

}


/*

const contact = new ContactModel(
  item.party,
  item.name,
  item.jobTitle,
  item.sex,
  item.gender,
  item.email,
  item.phoneNumber,
  item.faxNumber,
  item.preferredContactMethod,
  item.photoUrl,
  item.electorate,
  item.dateOfBirth,
  item.placeOfBirth,
  item.countryOfBirth,
  item.dateOfDeath,
  item.placeOfDeath,
  item.countryOfDeath
);

contact.id = item.id;

*/

/*

    contact.party.roles.every(item => {

      if (item.role === 'Contact' && item.reciprocalRole === 'Account') {

        contact.organisation.id = item.reciprocalPartyId;
        contact.organisation.displayName = item.reciprocalPartyName;
        contact.organisation.email = item.reciprocalPartyEmail;
        contact.organisation.phoneNumber = item.reciprocalPartyPhoneNumber;

        return false;
      }

      return true;

    });

*/

/*

  // adapt(item: any): ContactModel {
  adapt(item: any): any {

    this.logger.info('Item: ' + JSON.stringify(item, null, 2));

    const contact = item;

    if (item.photoUrl.includes('avatar.svg')) {
      contact.photoUrl = 'assets/' + item.photoUrl;
    } else {
      contact.photoUrl = this.getUrlPrefix() + item.photoUrl;
    }

    contact.party.roles.every(item => {

      if (item.role === CONTACT && item.reciprocalRole === ACCOUNT) {

        contact.organisation.id = item.reciprocalPartyId;
        contact.organisation.displayName = item.reciprocalPartyName;
        contact.organisation.email = item.reciprocalPartyEmail;
        contact.organisation.phoneNumber = item.reciprocalPartyPhoneNumber;

        return false;
      }

      return true;

    });

    // Flatten the object
    contact.address = item.party.addresses[0];

    this.logger.info('Adapted item: ' + JSON.stringify(contact, null, 2));

    return contact;
  }

 */
