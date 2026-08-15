package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.serendipity.party.type.PartyType;
import org.springframework.hateoas.RepresentationModel;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PartyModel extends RepresentationModel<PartyModel> {

  private String id;
  private PartyType type;
  private String legalEntityType;
  private String displayName;
  private Set<AddressModel> addresses;
  private Set<RoleModel> roles;

}
