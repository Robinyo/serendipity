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

}
