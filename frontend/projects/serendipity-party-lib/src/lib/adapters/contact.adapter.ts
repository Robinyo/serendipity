import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from "./party.adapter";

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
      item.sex,
      item.email,
      item.phoneNumber,
      item.photoUrl,
      item.electorate,
      item.dateOfBirth,
      item.placeOfBirth
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

    contact.id = btoa(item.id);

    contact.photoUrl = this.getUrlPrefix() + item.photoUrl;

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
