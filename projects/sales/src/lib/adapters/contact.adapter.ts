import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

import { Contact } from '../models/contact';
import { OrganisationRef } from '../models/organisation-ref';

import { LoggerService } from 'utils';

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
      item.names[0].title,
      item.names[0].givenName,
      item.names[0].middleName,
      item.names[0].familyName,
      item.names[0].honorific,
      item.names[0].salutation,
      item.names[0].preferredName,
      item.names[0].initials,
      item.dateOfBirth,
      item.placeOfBirth,
      item.gender,
      item.email,
      item.phoneNumber,
      item.photoUrl,
      item.electorate
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

    contact.id = btoa(item.id);

    contact.party.id = contact.id;
    contact.party.displayName = item.party.displayName;

    if (contact.gender === 'Male') {
      contact.photoUrl = 'assets/images/photos/male-avatar.svg';
    } else {
      contact.photoUrl = 'assets/images/photos/female-avatar.svg';
    }

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

/*

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
      item.title,
      item.givenName,
      item.middleName,
      item.familyName,
      item.honorific,
      item.salutation,
      item.preferredName,
      item.initials,
      item.gender,
      item.email,
      item.phoneNumber,
      item.photoUrl
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

    contact.party.id = btoa(item.party.id);

    contact.party.displayName = item.party.displayName;

    if (contact.gender === 'Male') {
      contact.photoUrl = 'assets/images/photos/male-avatar.svg';
    } else {
      contact.photoUrl = 'assets/images/photos/female-avatar.svg';
    }

    contact.party.addresses = contact.party.addresses.concat(item.party.addresses);
    contact.party.roles = contact.party.roles.concat(item.party.roles);

    if (contact.party.roles.length) {

      contact.organisation.id = btoa(contact.party.roles[0].reciprocalPartyId);
      contact.organisation.displayName = contact.party.roles[0].reciprocalPartyName;
      contact.organisation.email = contact.party.roles[0].reciprocalPartyEmail;
      contact.organisation.phoneNumber = contact.party.roles[0].reciprocalPartyPhoneNumber;
    }

    // this.logger.info('contact: ' + JSON.stringify(contact, null, 2));

    return contact;
  }
}

*/
