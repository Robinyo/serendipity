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
    public sex: string = '',
    public email: string = '',
    public phoneNumber: string = '',
    public photoUrl: string = '',
    public electorate: string = '',
    public dateOfBirth: string = '',
    public placeOfBirth: string = '',
    public countryOfBirth: string = ''
  ) {
    this.organisation = new OrganisationRef();
  }

  public organisation: OrganisationRef;

}

// https://google.github.io/styleguide/jsoncstyleguide.xml
