package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class IndividualModel extends RepresentationModel<IndividualModel> {

  private Long id;
  private PartyModel party;
  private NameModel name;
  private Set<IndividualNameModel> names;
  private String sex;
  // private String gender;
  private String email;
  private String phoneNumber;
  private String photoUrl;
  private String electorate;

  private LocalDateTime dateOfBirth;
  private String placeOfBirth;
  private String countryOfBirth;

  private LocalDateTime dateOfDeath;
  private String placeOfDeath;
  private String countryOfDeath;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof IndividualModel))
      return false;

    IndividualModel other = (IndividualModel) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}

// https://docs.spring.io/spring-hateoas/docs/current/reference/html/#fundamentals.representation-models
