import { Injectable } from '@angular/core';

import { Adapter, LoggerService } from 'utils-lib';

import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactAdapter implements Adapter<Contact> {

  constructor(private logger: LoggerService) {

    this.logger.info('ContactAdapter initialised');
  }

  adapt(item: any): Contact {

    // this.logger.info('item: ' + JSON.stringify(item, null, 2));

    const contact = new Contact(
      item.party,
      item.name,
      item.sex,
      item.email,
      item.phoneNumber,
      item.photoUrl,
      item.electorate,
      item.dateOfBirth,
      item.placeOfBirth,
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

    contact.id = btoa(item.id);

    contact.photoUrl = 'http://127.0.0.1:30101/' + item.photoUrl;

    if (item.party.addresses && item.party.addresses.length) {
      contact.party.addresses = contact.party.addresses.concat(item.party.addresses);
    }

    if (item.party.roles && item.party.roles.length) {

      contact.party.roles = contact.party.roles.concat(item.party.roles);

      contact.organisation.id = btoa(contact.party.roles[0].reciprocalPartyId);
      contact.organisation.displayName = contact.party.roles[0].reciprocalPartyName;
      contact.organisation.email = contact.party.roles[0].reciprocalPartyEmail;
      contact.organisation.phoneNumber = contact.party.roles[0].reciprocalPartyPhoneNumber;
    }

    // this.logger.info('contact: ' + JSON.stringify(contact, null, 2));

    return contact;
  }

}
