import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

import { Account } from '../models/account';

import { LoggerService } from 'utils';

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
      item.name,
      item.phoneNumber
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

    account.party.id = btoa(item.party.id);

    account.party.displayName = item.party.displayName;

    account.party.addresses = account.party.addresses.concat(item.party.addresses);
    account.party.roles = account.party.roles.concat(item.party.roles);

    if (account.party.roles.length) {

      account.individual.id = btoa(account.party.roles[0].reciprocalPartyId);
      account.individual.displayName = account.party.roles[0].reciprocalPartyName;
      account.individual.email = 'email';
      account.individual.phoneNumber = 'phoneNumber';
    }

    // this.logger.info('account: ' + JSON.stringify(account, null, 2));

    return account;
  }
}
