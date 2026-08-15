package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NameModel extends RepresentationModel<NameModel> {

  private String title;
  private String givenName;
  private String preferredName;
  private String middleName;
  private String familyName;
  private String initials;
  private String honorific;
  private String salutation;

}

// name prefix
// otherNames
// name suffix
// formalSalutation
