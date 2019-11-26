import { Party } from './party';

export class Organisation {

  constructor(
    public name: string = '',
    public phoneNumber: string = ''
  ) {
    this.party = new Party('Organisation');
  }

  public party: Party;

}
