package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
