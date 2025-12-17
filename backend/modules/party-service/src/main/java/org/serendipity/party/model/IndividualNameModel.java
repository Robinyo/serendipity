package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class IndividualNameModel extends RepresentationModel<IndividualNameModel> {

  private Long id;
  private String type;
  private String title;
  private String givenName;
  private String middleName;
  private String familyName;
  private String honorific;
  private String salutation;
  private String preferredName;
  private String initials;
  private LocalDateTime fromDate;
  private LocalDateTime toDate;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof IndividualNameModel))
      return false;

    IndividualNameModel other = (IndividualNameModel) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
