export class Name {

  constructor(
    public title: string = '',
    public givenName: string = '',
    public middleName: string = '',
    public familyName: string = '',
    public preferredName: string = '',
    public initials: string = '',
    public honorific: string = '',
    public salutation: string = ''

  ) {}

}

/*

  private String title;         // name prefix
  private String givenName;
  private String preferredGivenName;
  private String middleName;    // otherNames
  private String familyName;
  private String preferredFamilyName;
  private String preferredName; // informalSalutation
  private String initials;
  private String honorific;     // name suffix
  private String salutation;    // formalSalutation

*/
