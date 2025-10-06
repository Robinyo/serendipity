import { Address } from './address';
import { RoleModel } from './role';

export class Party {

  public id?: string;

  public legalType: string;

  constructor(
    public type: string = 'PARTY',
    public displayName: string = '',
    public addresses: Address[] = [],
    public roles: RoleModel[] = []
  ) {
    this.legalType = '';
  }

}
