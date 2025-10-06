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

  private String title;         // name prefix

  private String givenName;

  private String preferredGivenName;

  private String middleName;    // otherNames

  private String initials;

  @Column(name = "familyName", nullable = false)
  private String familyName;

  private String preferredFamilyName;

  private String preferredName; // informalSalutation

  private String honorific;     // name suffix

  private String salutation;    // formalSalutation

}

// @EmbeddedId
// public class Name implements Serializable {
