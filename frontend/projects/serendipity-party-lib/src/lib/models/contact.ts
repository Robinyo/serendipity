import { AddressModel } from './address';
import { IndividualModel } from './individual';

// tslint:disable-next-line:no-empty-interface
// export interface Contact extends Individual {}
export class ContactModel extends IndividualModel {
  address?: AddressModel;
}
