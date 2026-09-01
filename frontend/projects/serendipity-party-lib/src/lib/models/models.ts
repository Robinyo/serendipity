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

export interface IndividualModel {
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

export interface OrganisationModel {
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
