package org.serendipity.party.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class NameModel extends RepresentationModel<NameModel> {

  private Long id;
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

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof NameModel))
      return false;

    NameModel other = (NameModel) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
