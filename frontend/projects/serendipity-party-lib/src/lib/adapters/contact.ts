import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from './party';

import {ContactModel, createDefaultPartyRefModel, NameUpdateDto, PartyRefModel} from '../models/models';

const CONTACT = "Contact";
const ACCOUNT = "Account";

@Injectable({
  providedIn: 'root'
})
export class ContactAdapter extends PartyAdapter implements Adapter<ContactModel> {

  constructor() {
    super();
  }

  // Maps a deeply nested Spring HATEOAS entity into a flat,
  // key-value data structure that Form-js can ingest.

  adapt(response: any): any {

    if (!response) return null;

    this.logger.info('Response: ' + JSON.stringify(response, null, 2));

    const item = {

      type: response.party?.type,
      legalEntityType: response.party?.legalEntityType,
      toDate: response.party?.toDate,
      displayName: response.party?.displayName,

      name: response.name,
      jobTitle: response.jobTitle,
      sex: response.sex,
      gender: response.gender,
      email: response.email,
      phoneNumber: response.phoneNumber,
      faxNumber: response.faxNumber,
      preferredContactMethod: response.preferredContactMethod,
      photoUrl: response.photoUrl,
      electorate: response.electorate,
      dateOfBirth: response.dateOfBirth,
      placeOfBirth: response.placeOfBirth,
      countryOfBirth: response.countryOfBirth,
      dateOfDeath: response.dateOfDeath,
      placeOfDeath: response.placeOfDeath,
      countryOfDeath: response.countryOfDeath

    };

    // Compute photo URL
    // const photoUrl = item.photoUrl?.includes('avatar.svg')
    //   ? 'assets/' + item.photoUrl
    //   : this.getUrlPrefix() + (item.photoUrl || '');

    // Extract primary address with null-safety
    const primaryAddress = response.party?.addresses?.[0] ?? null;

    if (primaryAddress?._links) delete primaryAddress._links;

    let organisation: PartyRefModel = createDefaultPartyRefModel();

    // Extract Organisation properties from roles cleanly using .find()
    const accountRole = response.party?.roles?.find(
      (role: any) => role.role === CONTACT && role.reciprocalRole === ACCOUNT
    );

    if (accountRole) {

      this.logger.info('role.role === CONTACT && role.reciprocalRole === ACCOUNT');

      organisation.id = accountRole.reciprocalPartyId ?? '';
      organisation.displayName = accountRole.reciprocalPartyName ?? '';
      organisation.email = accountRole.reciprocalPartyName ?? '';
      organisation.phoneNumber = accountRole.reciprocalPartyPhoneNumber ?? '';

    }

    // Build flat, key-value data structure
    const contact: any = {
      ...item,
      address: primaryAddress,
      organisation
    };

    this.logger.info('Flattened response: ' + JSON.stringify(contact, null, 2));

    return contact;
  }

}
