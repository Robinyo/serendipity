// import 'reflect-metadata';
// import { Type } from 'class-transformer';

// export interface Address {
export class Address {

  constructor(
    line1: string = '',
    line2: string = '',
    city: string = '',
    state: string = '',
    postalCode: string = '',
    country: string = '',
    addressType: string = ''
  ) {

    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.addressType = addressType;

  }

  id?: number;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: string;

}
