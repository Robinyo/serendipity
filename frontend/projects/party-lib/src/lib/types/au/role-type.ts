export enum IndividualRoleType {
  AUTHORISED_CONTACT = 'Authorised Contact',
  EMPLOYEE = 'Employee',
  MEMBER = 'Member',
  PRIMARY_CONTACT = 'Primary Contact'
}

export enum OrganisationRoleType {
  EMPLOYER = 'Employer'
}

// From the ATO website
//
// NFP organisations that are companies or unincorporated associations carrying on business in Australia need to
// appoint a public officer.
//
// To contact us on behalf of an individual or entity, you must be either a primary contact or authorised contact.
// A primary contact can be a public officer or certain office holders.
//
// An authorised contact can be a registered tax agent, registered BAS agent, temporarily appointed tax professional or
// specialist tax adviser.
