import { AddressModel } from './address';
import { IndividualModel } from './individual';

// tslint:disable-next-line:no-empty-interface
// export interface Contact extends Individual {}
export class ContactModel extends IndividualModel {
  jobTitle?: string;
  faxNumber?: string;
  preferredContactMethod?: string | null;
  address?: AddressModel;
}
