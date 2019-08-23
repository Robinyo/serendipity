import 'reflect-metadata';
import { Expose, Type } from 'class-transformer';

// import { forwardRef } from '@angular/core';

import { Organisation } from './orgainisation';
import { Party } from './party';

// export function serializeType<T>(object: T) {
//   return function () { return object; };
// }

// export interface Individual {

// https://github.com/typestack/class-transformer/issues/108

// @dynamic
export class Individual {

  constructor(
    party: Party = {},
    organisation: Organisation = {},
    title: string = '',
    givenName: string = '',
    middleName: string = '',
    familyName: string = '',
    honorific: string = '',
    salutation: string = '',
    preferredName: string = '',
    initials: string = '',
    gender: string = '',
    email: string = '',
    phoneNumber: string = '',
    photoUrl: string = ''
  ) {

    this.party = party;
    this.organisation = organisation;
    this.title = title;
    this.givenName = givenName;
    this.middleName = middleName;
    this.familyName = familyName;
    this.honorific = honorific;
    this.salutation = salutation;
    this.preferredName = preferredName;
    this.initials = initials;
    this.gender = gender;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.photoUrl = photoUrl;

  }

  @Expose()
  id?: string;

  @Expose()
  @Type(() => Party)
  // @Type(serializeType(Party))
  // @Type(forwardRef(() => Party) as any)
  party?: Party;

  @Expose()
  @Type(() => Organisation)
  // @Type(serializeType(Organisation))
  // @Type(forwardRef(() => Organisation) as any)
  organisation?: Organisation;

  @Expose()
  title?: string;

  @Expose()
  givenName?: string;

  @Expose()
  middleName?: string;     // otherNames

  @Expose()
  familyName?: string;

  @Expose()
  honorific?: string;

  @Expose()
  salutation?: string;     // formalSalutation

  @Expose()
  preferredName?: string;  // informalSalutation

  @Expose()
  initials?: string;

  @Expose()
  gender?: string;

  @Expose()
  email?: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  photoUrl?: string;

}

// https://bet365techblog.com/default-values-typescript

// https://github.com/typestack/class-transformer/issues/108
// https://github.com/angular/angular/issues/21123
// https://github.com/angular/angular/issues/20216


/*

export interface Individual {

  id?: string;
  displayName?: string;
  title?: string;
  givenName?: string;
  middleName?: string;     // otherNames
  familyName?: string;
  honorific?: string;
  salutation?: string;     // formalSalutation
  preferredName?: string;  // informalSalutation
  initials?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  photoUrl?: string;

  'organisation': {
    id?: string;
    name?: string;
    phoneNumber?: string;
  };

  addresses: Address[];

}

*/
