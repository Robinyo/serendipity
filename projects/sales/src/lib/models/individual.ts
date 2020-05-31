import { Name } from './name';
import { OrganisationRef } from './organisation-ref';
import { Party } from './party';

import { PartyType } from '../types/party-type';

const defaultName: Name = new Name(
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
);

export class Individual {

  public id?: string;

  constructor(
    public party: Party = new Party(PartyType.INDIVIDUAL),
    public name: Name = defaultName,
    public sex: string = '',
    public email: string = '',
    public phoneNumber: string = '',
    public photoUrl: string = '',
    public electorate: string = '',
    public dateOfBirth: string = '',
    public placeOfBirth: string = '',
  ) {
    this.organisation = new OrganisationRef();
  }

  public organisation: OrganisationRef;

}

// https://google.github.io/styleguide/jsoncstyleguide.xml
