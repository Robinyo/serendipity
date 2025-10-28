package org.serendipity.party.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.util.Date;
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

  private Date dateOfBirth;
  private String placeOfBirth;
  private String countryOfBirth;

  private Date dateOfDeath;
  private String placeOfDeath;
  private String countryOfDeath;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof IndividualModel))
      return false;

    IndividualModel other = (IndividualModel) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}

// https://docs.spring.io/spring-hateoas/docs/current/reference/html/#fundamentals.representation-models
