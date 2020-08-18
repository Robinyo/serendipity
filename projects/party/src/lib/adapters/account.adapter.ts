import { Injectable } from '@angular/core';

import { Adapter, LoggerService } from 'utils';

import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountAdapter implements Adapter<Account> {

  constructor(private logger: LoggerService) {

    this.logger.info('AccountAdapter initialised');
  }

  adapt(item: any): Account {

    // this.logger.info('item: ' + JSON.stringify(item, null, 2));

    const account = new Account(
      item.party,
      item.name,
      item.email,
      item.phoneNumber
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

    account.id = btoa(item.id);

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

    // this.logger.info('account: ' + JSON.stringify(account, null, 2));

    return account;
  }

}
