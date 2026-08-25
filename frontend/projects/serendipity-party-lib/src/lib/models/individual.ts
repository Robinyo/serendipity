import { NameModel } from './name.js';
import { OrganisationRefModel } from './organisation-ref.js';
import { PartyModel } from './party.js';

// import { PartyType } from '../types/party-type';

const defaultName: NameModel = new NameModel(
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
);

export class IndividualModel {

  public id?: string;

  constructor(
    public party: PartyModel,
    public name: NameModel,
    public jobTitle: string | null,
    public sex: string = '',
    public gender: string = '',
    public email: string = '',
    public phoneNumber: string = '',
    public faxNumber: string | null = '',
    public preferredContactMethod: string | null = '',
    public photoUrl: string = '',
    public electorate: string = '',
    public dateOfBirth: string = '',
    public placeOfBirth: string = '',
    public countryOfBirth: string = '',
    public dateOfDeath: string = '',
    public placeOfDeath: string = '',
    public countryOfDeath: string = ''

  ) {}

  public organisation?: OrganisationRefModel;

}

// this.organisation = new OrganisationRef();

// https://google.github.io/styleguide/jsoncstyleguide.xml
