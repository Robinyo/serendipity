package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IndividualNameModel extends RepresentationModel<IndividualNameModel> {

  private String partyPublicId;
  private String type;

  // @Embedded
  // private Name name;
  private String title;
  private String givenName;
  private String preferredName;
  private String middleName;
  private String familyName;
  private String initials;
  private String honorific;
  private String salutation;

  private LocalDateTime fromDate;
  private LocalDateTime toDate;

}
