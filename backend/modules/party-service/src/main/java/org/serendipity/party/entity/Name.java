package org.serendipity.party.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Embeddable;

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
