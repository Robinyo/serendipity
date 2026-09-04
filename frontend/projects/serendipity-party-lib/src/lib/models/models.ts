//
// Base models (i.e., they have an 'id')
//

export interface ElectoralDivisionModel {
  id?: string;
  name?: string;
  nameDerivation?: string;
  state?: string;
  area?: string;
  locationDescription?: string;
  dateGazetted?: string;
  latitude?: string;
  longitude?: string;
}

export interface LocationModel {
  id?: string;
  type?: string;
  displayName?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PartyModel {
  id?: string;
  type?: string;
  displayName?: string;
  addresses?: AddressModel[];
  roles?: RoleModel[];
  legalEntityType?: string;
}

export interface PartyRefModel {
  id?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
}

export function createDefaultPartyRefModel(): PartyRefModel {
  return {
    id: '',
    displayName: '',
    email: '',
    phoneNumber: ''
  };
}

export interface IndividualSummaryModel {
  id?: string;
  partyDisplayName?: string;
  email?: string;
  phoneNumber?: string;
  organisationId?: string;
  organisationDisplayName?: string;
  organisationEmail?: string;
  organisationPhoneNumber?: string;
}

export interface OrganisationSummaryModel {
  id?: string;
  partyDisplayName?: string;
  email?: string;
  phoneNumber?: string;
  individualId?: string;
  individualDisplayName?: string;
  individualEmail?: string;
  individualPhoneNumber?: string;
}

export interface RoleModel {
  id?: string;
  role?: string;
  partyId?: string;
  partyType?: string;
  partyName?: string;
  partyEmail?: string;
  partyPhoneNumber?: string;
  relationship?: string;
  reciprocalRole?: string;
  reciprocalPartyId?: string;
  reciprocalPartyType?: string;
  reciprocalPartyName?: string;
  reciprocalPartyEmail?: string;
  reciprocalPartyPhoneNumber?: string;
}

//
// Misc
//

export interface NameModel {
  title?: string;
  givenName?: string;
  preferredName?: string;
  middleName?: string;
  familyName?: string;
  initials?: string;
  honorific?: string;
  salutation?: string;
}

//
// Derived models
//

export interface AddressModel {
  location?: LocationModel;
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: string;
}

interface IndividualModel {
  party?: PartyModel,
  name?: NameModel,
  jobTitle?: string;
  sex?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  faxNumber?: string;
  preferredContactMethod?: string;
  photoUrl?: string;
  electorate?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  countryOfBirth?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
  countryOfDeath?: string;
}

interface OrganisationModel {
  party?: PartyModel;
  name?: string;
  email?: string;
  phoneNumber?: string;
  faxNumber?: string;
  preferredContactMethod?: string;
  establishmentDate?: string;
}

export interface ContactModel extends IndividualModel {
  address?: AddressModel;
  organisation?: PartyRefModel;
}

export interface ContactSummaryModel extends IndividualSummaryModel {}

export interface AccountModel extends OrganisationModel {
  address?: AddressModel;
  individual?: PartyRefModel;
}

export interface AccountSummaryModel extends OrganisationSummaryModel {}

export interface AddressUpdateDto {
  name?: string | null;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: string;
}

export interface NameUpdateDto {
  title?: string | null;
  givenName?: string;
  preferredName?: string | null;
  middleName?: string | null;
  familyName?: string;
  initials?: string | null;
  honorific?: string | null;
  salutation?: string | null;
}

export interface ContactUpdateDto {
  type?: string;
  legalEntityType?: string;
  displayName?: string;
  name?: NameUpdateDto;
  jobTitle?: string | null;
  sex?: string | null;
  gender?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  faxNumber?:string | null;
  preferredContactMethod?: string | null;
  photoUrl?: string | null;
  electorate?: string | null;
  dateOfBirth?: string | null;
  placeOfBirth?: string | null;
  countryOfBirth?: string | null;
  dateOfDeath?: string | null;
  placeOfDeath?: string | null;
  countryOfDeath?: string | null;
  toDate?: string | null;
  address?: AddressModel;
  organisation?: PartyRefModel;
}

export interface AccountUpdateDto {
  type?: string;
  legalEntityType?: string;
  name?: string;
  email?: string | null;
  phoneNumber?: string | null;
  faxNumber?:string | null;
  preferredContactMethod?: string | null;
  establishmentDate?: string | null;
  toDate?: string | null;
  address?: AddressUpdateDto;
  individual?: PartyRefModel;
}
