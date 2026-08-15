package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.serendipity.party.type.PartyType;
import org.springframework.hateoas.RepresentationModel;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleModel extends RepresentationModel<RoleModel> {

  private String id;
  private String role;
  private String partyId;
  private PartyType partyType;
  private String partyName;
  private String partyEmail;
  private String partyPhoneNumber;
  private String relationship;
  private String reciprocalRole;
  private String reciprocalPartyId;
  private PartyType reciprocalPartyType;
  private String reciprocalPartyName;
  private String reciprocalPartyEmail;
  private String reciprocalPartyPhoneNumber;

}
