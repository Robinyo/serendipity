import { OrganisationRef } from './organisation-ref';
import { Party } from './party';
import { Name } from './name';

export class Individual {

  public id?: string;

  constructor(
    public party: Party,
    public name: Name,
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

/*

export class Individual {

  public id?: string;

  constructor(
    public title: string = '',
    public givenName: string = '',
    public middleName: string = '',
    public familyName: string = '',
    public honorific: string = '',
    public salutation: string = '',
    public preferredName: string = '',
    public initials: string = '',
    public dateOfBirth: string = '',
    public placeOfBirth: string = '',
    public sex: string = '',
    public email: string = '',
    public phoneNumber: string = '',
    public photoUrl: string = '',
    public electorate: string = ''
  ) {
    this.party = new Party('INDIVIDUAL');
    this.organisation = new OrganisationRef();
  }

  public party: Party;

  public organisation: OrganisationRef;

}

*/
