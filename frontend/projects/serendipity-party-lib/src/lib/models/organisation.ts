import { IndividualRef } from './individual-ref';
import { PartyModel } from './party';

import { PartyType } from '../types/party-type';

export class OrganisationModel {

  public id?: string;

  constructor(
    public party: PartyModel = new PartyModel(PartyType.ORGANISATION),
    public name: string = '',
    public email: string = '',
    public phoneNumber: string = ''
  ) {
    this.individual = new IndividualRef();
  }

  public individual: IndividualRef;

}
