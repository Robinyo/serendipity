import { Injectable } from '@angular/core';

import { Adapter } from 'serendipity-utils-lib';

import { RoleModel } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleAdapter implements Adapter<RoleModel> {

  adapt(item: any): RoleModel {

    // this.logger.info('item: ' + JSON.stringify(item, null, 2));

    const role = new RoleModel(
      item.role,
      item.partyId,
      item.partyType,
      item.partyName,
      item.partyEmail,
      item.partyPhoneNumber,
      item.relationship,
      item.reciprocalRole,
      item.reciprocalPartyId,
      item.reciprocalPartyType,
      item.reciprocalPartyName,
      item.reciprocalPartyEmail,
      item.reciprocalPartyPhoneNumber
    );

    role.id = item.id;

    // this.logger.info('contact: ' + JSON.stringify(role, null, 2));

    return role;
  }

}
