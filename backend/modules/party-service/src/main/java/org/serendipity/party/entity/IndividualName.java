package org.serendipity.party.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class IndividualName {

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "SequenceIndividualName")
  @SequenceGenerator(
    name = "SequenceIndividualName",
    allocationSize = 1
  )
  private Long id;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "individualId", nullable = false)
  private Individual individual;

  @Column(name = "type", nullable = false)
  private String type;

  @Embedded
  private Name name;

  @Temporal(TemporalType.TIMESTAMP)
  private Date fromDate;

  @Temporal(TemporalType.TIMESTAMP)
  private Date toDate;

}

/*

  @Column(name = "type", nullable = false)
  private String type;

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

*/

/*

  @Builder.Default
  private String type = "";     // usageType: Legal Name

  private String title;         // name prefix

  private String givenName;

  private String middleName;    // otherNames

  @Column(name = "familyName", nullable = false)
  private String familyName;

  private String honorific;

  private String salutation;    // formalSalutation

  private String preferredName; // informalSalutation

  private String initials;

*/
