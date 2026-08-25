import { AddressModel } from './address.js';
import { IndividualModel } from './individual.js';

// tslint:disable-next-line:no-empty-interface
// export interface Contact extends Individual {}
export class ContactModel extends IndividualModel {
  address?: AddressModel;
}
