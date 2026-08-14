import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from './party';

import { ContactModel } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactAdapter extends PartyAdapter implements Adapter<ContactModel> {

  constructor() {

    super();

    // this.logger.info('Contact Adapter initialised');

  }

  adapt(item: any): ContactModel {

    // this.logger.info('item: ' + JSON.stringify(item, null, 2));

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

    contact.id = item.partyPublicId;

    contact.address = item.party.addresses[0];

    if (item.photoUrl.includes('avatar.svg')) {
      contact.photoUrl = 'assets/' + item.photoUrl;
    } else {
      contact.photoUrl = this.getUrlPrefix() + item.photoUrl;
    }

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

    // this.logger.info('contact: ' + JSON.stringify(contact, null, 2));

    return contact;
  }

}
