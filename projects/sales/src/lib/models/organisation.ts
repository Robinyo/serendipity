import { IndividualRef } from './individual-ref';
import { Party } from './party';

export class Organisation {

  public id?: string;

  constructor(
    public name: string = '',
    public email: string = '',
    public phoneNumber: string = ''
  ) {
    this.party = new Party('ORGANISATION');
    this.individual = new IndividualRef();
  }

  public party: Party;

  public individual: IndividualRef;

}
