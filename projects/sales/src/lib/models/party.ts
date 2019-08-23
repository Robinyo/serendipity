import 'reflect-metadata';
import { Type } from 'class-transformer';

import { Address } from './address';
import { Role } from './role';

// export interface Party {

// @dynamic
export class Party {

  id?: number;
  partyType?: string;
  displayName?: string;

  @Type(() => Address)
  addresses?: Address[];

  @Type(() => Role)
  roles?: Role[];

}
