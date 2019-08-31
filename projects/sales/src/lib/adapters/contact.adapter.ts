import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

import { Contact } from '../models/contact';
import { Organisation } from '../models/orgainisation';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class ContactAdapter implements Adapter<Contact> {

  constructor(private logger: LoggerService) {

    this.logger.info('ContactAdapter initialised');
  }

  adapt(item: any): Contact {

    // this.logger.info('item: ' + JSON.stringify(item));

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

    contact.party.id = btoa(item.party.id);
    contact.party.displayName = item.party.displayName;

    contact.party.addresses = contact.party.addresses.concat(item.party.addresses);
    contact.party.roles = contact.party.roles.concat(item.party.roles);

    if (contact.party.roles.length) {

      contact.organisation.name = contact.party.roles[0].reciprocalPartyName;
      contact.organisation.phoneNumber = contact.phoneNumber;

    }

    // this.logger.info('contact: ' + JSON.stringify(contact));

    return contact;
  }
}
