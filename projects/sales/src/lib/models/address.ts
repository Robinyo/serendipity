import { Location } from './location';

export class Address {

  constructor(
    public line1: string = '',
    public line2: string = '',
    public city: string = '',
    public state: string = '',
    public postalCode: string = '',
    public country: string = '',
    public addressType: string = ''
  ) {
    this.location = new Location('Address');
  }

  get id(): string {
    return this.location.id;
  }

  location?: Location;

}
