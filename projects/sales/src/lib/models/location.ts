import 'reflect-metadata';
// import { Type } from 'class-transformer';

// https://github.com/typestack/class-transformer/issues/108

// @dynamic
export class Location {

  constructor(
    type: string = 'Location'
  ) {
    this.type = type;
  }

  id?: string;
  type?: string;

}
