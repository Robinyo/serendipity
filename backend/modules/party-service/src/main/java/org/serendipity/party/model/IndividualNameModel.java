package org.serendipity.party.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.springframework.hateoas.RepresentationModel;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IndividualNameModel extends RepresentationModel<IndividualNameModel> {

  private String id;
  private String type;
  private String givenName;
  private String preferredName;
  private String middleName;
  private String familyName;
  private String initials;
  private String honorific;
  private String salutation;
  private String fromDate;
  private String toDate;

}
