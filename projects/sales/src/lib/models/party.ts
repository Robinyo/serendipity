import { Address } from './address';
import { Role } from './role';

export class Party {

  public id?: string;

  constructor(
    public type: string = 'Party',
    public displayName: string = '',
    public addresses: Address[] = [],
    public roles: Role[] = []
  ) {}

}
