import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { PartyAdapter } from './party';

import { AccountModel } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountAdapter extends PartyAdapter implements Adapter<AccountModel> {

  constructor() {

    super();

    // this.logger.info('Account Adapter initialised');

  }

  adapt(item: any): AccountModel {

    // this.logger.info('item: ' + JSON.stringify(item, null, 2));

    const account = new AccountModel(
      item.party,
      item.name,
      item.email,
      item.phoneNumber
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

    account.id = btoa(item.id);

    if (account.party.roles && account.party.roles.length) {

      account.individual.id = btoa(account.party.roles[0].reciprocalPartyId);
      account.individual.displayName = account.party.roles[0].reciprocalPartyName;
      account.individual.email = account.party.roles[0].reciprocalPartyEmail;
      account.individual.phoneNumber = account.party.roles[0].reciprocalPartyPhoneNumber;
    }

    // this.logger.info('account: ' + JSON.stringify(account, null, 2));

    return account;
  }

}

/*

    if (item.party.addresses && item.party.addresses.length) {
      account.party.addresses = account.party.addresses.concat(item.party.addresses);
    }

    if (item.party.roles && item.party.roles.length) {

      account.party.roles = account.party.roles.concat(item.party.roles);

      account.individual.id = btoa(account.party.roles[0].reciprocalPartyId);
      account.individual.displayName = account.party.roles[0].reciprocalPartyName;
      account.individual.email = account.party.roles[0].reciprocalPartyEmail;
      account.individual.phoneNumber = account.party.roles[0].reciprocalPartyPhoneNumber;
    }


*/
