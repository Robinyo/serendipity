import { IndividualRef } from './individual-ref';
import { Party } from './party';

export class Organisation {

  constructor(
    public name: string = '',
    public phoneNumber: string = ''
  ) {
    this.party = new Party('Organisation');
    this.individual = new IndividualRef();
  }

  public party: Party;

  public individual: IndividualRef;

}
