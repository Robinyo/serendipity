package org.serendipity.party.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class OrganisationModel extends RepresentationModel<OrganisationModel> {

  private Long id;
  private PartyModel party;
  private String name;
  private String email;
  private String phoneNumber;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof OrganisationModel))
      return false;

    OrganisationModel other = (OrganisationModel) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
