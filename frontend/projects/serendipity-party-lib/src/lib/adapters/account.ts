import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from './party';

import { AccountModel, createDefaultPartyRefModel, PartyRefModel } from '../models/models';

const PRIMARY_CONTACT = "Primary Contact";

@Injectable({
  providedIn: 'root'
})
export class AccountAdapter extends PartyAdapter implements Adapter<AccountModel> {

  constructor() {
    super();
  }

  // Maps a deeply nested Spring HATEOAS entity into a flat,
  // key-value data structure that Form-js can ingest.

  adapt(response: any): any {

    if (!response) return null;

    this.logger.info('Response: ' + JSON.stringify(response, null, 2));

    const item = {

      id: response.id,

      displayName: response.party?.displayName,
      legalEntityType: response.party?.legalEntityType,

      name: response.name,
      email: response.email,
      phoneNumber: response.phoneNumber,
      faxNumber: response.faxNumber,
      preferredContactMethod: response.preferredContactMethod,
      establishmentDate: response.establishmentDate

    };

    let individual: PartyRefModel = createDefaultPartyRefModel();

    // Find the Account's Primary Contact
    const primaryContact = response.party?.roles?.find(
      (role: any) => role.reciprocalRole === PRIMARY_CONTACT
    );

    if (primaryContact) {

      this.logger.info('role.reciprocalRole === PRIMARY_CONTACT');

      individual.id = primaryContact.reciprocalPartyId ?? '';
      individual.displayName = primaryContact.reciprocalPartyName ?? '';
      individual.email = primaryContact.reciprocalPartyName ?? '';
      individual.phoneNumber = primaryContact.reciprocalPartyPhoneNumber ?? '';

    }

    // Extract primary address with null-safety
    const primaryAddress = response.party?.addresses?.[0] ?? null;

    // Build flat, key-value data structure
    const account: any = {
      ...item,
      address: primaryAddress,
      individual
    };

    this.logger.info('Flattened response: ' + JSON.stringify(account, null, 2));

    return account;
  }

}
