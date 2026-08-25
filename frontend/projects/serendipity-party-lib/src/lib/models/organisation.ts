import { IndividualRefModel } from './individual-ref.js';
import { PartyModel } from './party.js';

// import { PartyType } from '../types/party-type';

export class OrganisationModel {

  public id?: string | number;

  constructor(
    public party: PartyModel,
    public name: string = '',
    public email: string = '',
    public phoneNumber: string = '',
    public faxNumber: string | null = '',
    public preferredContactMethod: string | null = '',
    public establishmentDate: string
  ) {}

  public individual?: IndividualRefModel;

}

// public party: PartyModel = new PartyModel(PartyType.ORGANISATION),
// this.individual = new IndividualRefModel();
