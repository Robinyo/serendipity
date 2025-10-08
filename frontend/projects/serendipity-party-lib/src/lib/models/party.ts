import { AddressModel } from './address';
import { RoleModel } from './role';

export class PartyModel {

  public id?: string;

  public legalType: string;

  constructor(
    public type: string = 'PARTY',
    public displayName: string = '',
    public addresses: AddressModel[] = [],
    public roles: RoleModel[] = []
  ) {
    this.legalType = '';
  }

}
