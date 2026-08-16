package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.core.Relation;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Relation(collectionRelation = "organisations", itemRelation = "organisation")
public class OrganisationSummaryModel extends RepresentationModel<OrganisationSummaryModel>{

  private String id;
  private String partyDisplayName;
  private String email;
  private String phoneNumber;
  private String individualId;
  private String individualDisplayName;
  private String individualEmail;
  private String individualPhoneNumber;

}
