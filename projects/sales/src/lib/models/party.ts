import 'reflect-metadata';
import { Type } from 'class-transformer';

import { Address } from './address';
import { Role } from './role';

// https://github.com/typestack/class-transformer/issues/108

// @dynamic
export class Party {

  id?: string;
  partyType?: string;
  displayName?: string;

  @Type(() => Address)
  addresses?: Address[];

  @Type(() => Role)
  roles?: Role[];

}

// export interface Party {
