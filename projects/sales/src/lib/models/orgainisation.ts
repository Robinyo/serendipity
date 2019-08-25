import 'reflect-metadata';
import { Expose, Type } from 'class-transformer';

import { Party } from './party';

// https://github.com/typestack/class-transformer/issues/108

// @dynamic
export class Organisation {

  // get id(): string {
  //   return this.party.id;
  // }

  @Expose()
  @Type(() => Party)
  party?: Party;

  @Expose()
  name?: string;

  @Expose()
  phoneNumber?: string;

}
