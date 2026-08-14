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
@Relation(collectionRelation = "individuals", itemRelation = "individual")
public class IndividualSummaryModel extends RepresentationModel<IndividualSummaryModel> {

  private String id;
  private String partyDisplayName;
  private String email;
  private String organisationId;
  private String organisationDisplayName;
  private String organisationEmail;
  private String organisationPhoneNumber;

}
