import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from './party';

import { AccountModel } from '../models/account';
import { IndividualRefModel } from '../models/individual-ref';
import {OrganisationRefModel} from '../models/organisation-ref';

const PRIMARY_CONTACT = "Primary Contact";

@Injectable({
  providedIn: 'root'
})
export class AccountAdapter extends PartyAdapter implements Adapter<AccountModel> {

  constructor() {
    super();
  }

  adapt(item: any): any {

    this.logger.info('Item: ' + JSON.stringify(item, null, 2));

    // 1. Instantiate a new IndividualRefModel instance (or default to empty strings)
    let individual = new IndividualRefModel('', '', '', '');

    // 2. Extract organisation properties from roles cleanly using .find()
    const primaryContactRole = item.party?.roles?.find(
      (role: any) => role.reciprocalRole === PRIMARY_CONTACT
    );

    if (primaryContactRole) {

      this.logger.info('role.reciprocalRole === PRIMARY_CONTACT');

      individual = new IndividualRefModel(
        primaryContactRole.reciprocalPartyId ?? '',
        primaryContactRole.reciprocalPartyName ?? '',
        primaryContactRole.reciprocalPartyEmail ?? '',
        primaryContactRole.reciprocalPartyPhoneNumber ?? ''
      );

    }

    // 3. Extract primary address with null-safety
    const primaryAddress = item.party?.addresses?.[0] ?? null;

    // TODO
    item.establishmentDate = null;

    // 4. Build summary Account payload
    const account: any = {
      ...item,
      address: primaryAddress,
      individual
    };

    this.logger.info('Adapted item: ' + JSON.stringify(account, null, 2));

    return account;
  }

}
