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

}

// https://docs.spring.io/spring-hateoas/docs/current/reference/html/#fundamentals.representation-models
