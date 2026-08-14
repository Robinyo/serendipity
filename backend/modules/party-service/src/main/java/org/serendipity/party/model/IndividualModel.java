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
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IndividualModel extends RepresentationModel<IndividualModel> {

  private String partyPublicId;
  private PartyModel party;
  private NameModel name;
  private Set<IndividualNameModel> names;
  private String jobTitle;
  private String sex;
  private String gender;
  private String email;
  private String phoneNumber;
  private String faxNumber;
  private String preferredContactMethod;
  private String photoUrl;
  private String electorate;
  private LocalDateTime dateOfBirth;
  private String placeOfBirth;
  private String countryOfBirth;
  private LocalDateTime dateOfDeath;
  private String placeOfDeath;
  private String countryOfDeath;

}

// https://docs.spring.io/spring-hateoas/docs/current/reference/html/#fundamentals.representation-models
