export enum RelationshipType {
  EMPLOYMENT = 'Employment',
  MEMBERSHIP = 'Membership',
  OFFICE_HOLDER = 'Office Holder',
  PUBLIC_OFFICER = 'Public Officer'
}

// For example:
//
// | Party             | Role            | Relationship   | Role            | Party             |
// | ----------------- | --------------- | -------------- | --------------- | ----------------- |
// | Australian Greens | Political Party | Office Holder  | Primary Contact | Jordan Hull       |
// | Jordan Hull       | Member          | Membership     | Political Party | Australian Greens |
// | Jordan Hull       | Public Officer  | Office Holder  | Political Party | Australian Greens |
//
// | Party              | Role        | Relationship          | Role        | Party                           |
// | ------------------ | ----------- | --------------------- | ----------- | ------------------------------- |
// | Homer Simpson      | Husband     | Marriage              | Wife        | Marge Simpson                   |
// | Homer Simpson      | Employee    | Employment            | Employer    | Springfield Nuclear Power Plant |
// | Homer Simpson      | Member      | Membership            | Association | Mensa International             |
// | Homer Simpson      | Trustee     | Trusteeship           | Trust       | The Simpson Family Trust        |
// | Homer Simpson      | Investor    | Investment Management | Advisor     | Pumpkin Investment Services     |

// type RelationshipType = 'Employment' | 'Membership' | 'Office Bearer';
