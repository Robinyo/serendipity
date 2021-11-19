import { Injectable } from '@angular/core';

import { Adapter, EnvironmentService, LoggerService } from 'utils-lib';

import { PartyAdapter } from "./party.adapter";

import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactAdapter extends PartyAdapter implements Adapter<Contact> {

  constructor(environmentService: EnvironmentService,
              logger: LoggerService) {

    super(environmentService, logger);

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

/*

    if (contact.party.roles && contact.party.roles.length) {

      contact.organisation.id = btoa(contact.party.roles[0].reciprocalPartyId);
      contact.organisation.displayName = contact.party.roles[0].reciprocalPartyName;
      contact.organisation.email = contact.party.roles[0].reciprocalPartyEmail;
      contact.organisation.phoneNumber = contact.party.roles[0].reciprocalPartyPhoneNumber;

    }

*/

/*

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

*/
