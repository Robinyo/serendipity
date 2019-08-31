import { Organisation } from './orgainisation';
import { Party } from './party';

export class Individual {

  constructor(
    public title: string = '',
    public givenName: string = '',
    public middleName: string = '',
    public familyName: string = '',
    public honorific: string = '',
    public salutation: string = '',
    public preferredName: string = '',
    public initials: string = '',
    public gender: string = '',
    public email: string = '',
    public phoneNumber: string = '',
    public photoUrl: string = ''
  ) {
    this.party = new Party('Individual');
    this.organisation = new Organisation();
  }

  public party: Party;

  public organisation: Organisation;

}

// https://google.github.io/styleguide/jsoncstyleguide.xml
