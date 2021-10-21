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

}
