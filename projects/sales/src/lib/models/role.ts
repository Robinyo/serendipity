// import 'reflect-metadata';
// import { Type } from 'class-transformer';

// https://github.com/typestack/class-transformer/issues/108

// @dynamic
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
