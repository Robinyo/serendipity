import { Address } from './address';
import { Role } from './role';

export interface Party {

  id?: number;
  partyType?: string;
  displayName?: string;
  addresses?: Address[];
  roles?: Role[];

}
