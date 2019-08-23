// import 'reflect-metadata';
// import { Type } from 'class-transformer';

// export interface Role {

export class Role {

  id?: number;
  role?: string;
  partyId?: string;
  partyType?: string;
  partyName?: string;
  relationship?: string;
  reciprocalRole?: string;
  reciprocalPartyId?: string;
  reciprocalPartyType?: string;
  reciprocalPartyName?: string;

}
