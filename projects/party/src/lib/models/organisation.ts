import { IndividualRef } from './individual-ref';
import { Party } from './party';

import { PartyType } from '../types/party-type';

export class Organisation {

  public id?: string;

  constructor(
    public party: Party = new Party(PartyType.ORGANISATION),
    public name: string = '',
    public email: string = '',
    public phoneNumber: string = ''
  ) {
    this.individual = new IndividualRef();
  }

  public individual: IndividualRef;

}
