package org.serendipity.party.model;

import lombok.*;
import org.serendipity.party.type.PartyType;
import org.springframework.hateoas.RepresentationModel;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class RoleModel extends RepresentationModel<RoleModel> {

  private Long id;
  private String role;
  private Long partyId;
  private PartyType partyType;
  private String partyName;
  private String partyEmail;
  private String partyPhoneNumber;
  private String relationship;
  private String reciprocalRole;
  private Long reciprocalPartyId;
  private PartyType reciprocalPartyType;
  private String reciprocalPartyName;
  private String reciprocalPartyEmail;
  private String reciprocalPartyPhoneNumber;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof RoleModel))
      return false;

    RoleModel other = (RoleModel) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
