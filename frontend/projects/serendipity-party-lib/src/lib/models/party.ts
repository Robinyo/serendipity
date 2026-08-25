import { AddressModel } from './address.js';
import { RoleModel } from './role.js';

export class PartyModel {

  public id?: string ;

  public legalEntityType: string;

  constructor(
    public type: string = 'PARTY',
    public displayName: string = '',
    public addresses: AddressModel[] = [],
    public roles: RoleModel[] = []
  ) {
    this.legalEntityType = '';
  }

}
