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
public class OrganisationModel extends RepresentationModel<OrganisationModel> {

  private String id;
  private PartyModel party;
  private String name;
  private String email;
  private String phoneNumber;
  private String faxNumber;
  private String preferredContactMethod;
  private LocalDateTime establishmentDate;

}

// https://docs.spring.io/spring-hateoas/docs/current/reference/html/#fundamentals.representation-models
