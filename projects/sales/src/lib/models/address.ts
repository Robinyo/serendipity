import 'reflect-metadata';
import { Type } from 'class-transformer';

import { Location } from './location';

// https://github.com/typestack/class-transformer/issues/108

// @dynamic
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

    this.location = {
      type: 'Address'
    } ;

    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.addressType = addressType;

  }

  get id(): string {
    return this.location.id;
  }

  @Type(() => Location)
  location?: Location;

  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: string;

}
