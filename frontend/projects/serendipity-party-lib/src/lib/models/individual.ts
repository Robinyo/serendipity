import { NameModel } from './name';
import { OrganisationRef } from './organisation-ref';
import { PartyModel } from './party';

import { PartyType } from '../types/party-type';

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
    public party: PartyModel = new PartyModel(PartyType.INDIVIDUAL),
    public name: NameModel = defaultName,
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

  ) {
    this.organisation = new OrganisationRef();
  }

  public organisation: OrganisationRef;

}

// https://google.github.io/styleguide/jsoncstyleguide.xml
