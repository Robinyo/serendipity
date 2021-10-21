package org.serendipity.party.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class NameModel extends RepresentationModel<NameModel> {

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

}
