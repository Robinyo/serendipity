import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from './party';

import { ContactModel, createDefaultPartyRefModel } from '../models/models';

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
    let organisation = createDefaultPartyRefModel();

    // 2. Extract organisation properties from roles cleanly using .find()
    const accountRole = item.party?.roles?.find(
      (role: any) => role.role === CONTACT && role.reciprocalRole === ACCOUNT
    );

    if (accountRole) {

      this.logger.info('role.role === CONTACT && role.reciprocalRole === ACCOUNT');

      organisation.id = accountRole.reciprocalPartyId ?? '';
      organisation.displayName = accountRole.reciprocalPartyName ?? '';
      organisation.email = accountRole.reciprocalPartyName ?? '';
      organisation.phoneNumber = accountRole.reciprocalPartyPhoneNumber ?? '';

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
