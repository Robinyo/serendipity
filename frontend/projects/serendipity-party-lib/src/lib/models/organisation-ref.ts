export class OrganisationRefModel {

  constructor(
    public id: string,
    public displayName: string,
    public email: string,
    public phoneNumber: string
  ) {}

}

/*

export interface OrganisationRefModel {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
}

*/

// OrganisationLinkModel

/*

import { IndividualRef } from './individual-ref';

// tslint:disable-next-line:no-empty-interface
// export interface Contact extends Individual {}
export class OrganisationRef extends IndividualRef {}

*/
