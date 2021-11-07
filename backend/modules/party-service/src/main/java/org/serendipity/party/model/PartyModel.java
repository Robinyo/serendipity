package org.serendipity.party.model;

import lombok.*;
import org.serendipity.party.type.PartyType;
import org.springframework.hateoas.RepresentationModel;

import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class PartyModel extends RepresentationModel<PartyModel> {

  private Long id;
  private PartyType type;
  private String legalType;
  private String displayName;
  private Set<AddressModel> addresses;
  private Set<RoleModel> roles;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof PartyModel))
      return false;

    PartyModel other = (PartyModel) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
