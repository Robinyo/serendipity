package org.serendipity.party.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Name {

  private String title;

  private String givenName;

  private String preferredName;

  private String middleName;

  @Column(name = "familyName", nullable = false)
  private String familyName;

  private String initials;

  private String honorific;

  private String salutation;

}

// name prefix
// informalSalutation
// otherNames
// name suffix
// formalSalutation
