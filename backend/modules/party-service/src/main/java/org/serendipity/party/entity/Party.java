package org.serendipity.party.entity;

import lombok.*;
import org.serendipity.party.type.PartyType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Party {

  // When using Hibernate, the IDENTITY generator is not a good choice since it disables JDBC batching.
  // See: https://vladmihalcea.com/14-high-performance-java-persistence-tips/
  //      https://vladmihalcea.com/jpa-entity-identifier-sequence/

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "SequenceParty")
  @SequenceGenerator(
    name = "SequenceParty",
    allocationSize = 1
  )
  private Long id;

  @Builder.Default
  @Enumerated(EnumType.STRING)
  private PartyType type = PartyType.INDIVIDUAL;

  @Builder.Default
  private String legalType = "";

  @Builder.Default
  private String displayName = "";

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name = "PartyAddress",
    joinColumns = @JoinColumn(name = "partyId"),
    inverseJoinColumns = @JoinColumn(name = "locationId")
  )
  private Set<Address> addresses;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name = "PartyRole",
    joinColumns = @JoinColumn(name = "partyId"),
    inverseJoinColumns = @JoinColumn(name = "roleId")
  )
  private Set<Role> roles;

  //
  // Spring Data audit annotations in nested (embeddable) classes isn't supported yet.
  // See: https://jira.spring.io/browse/DATACMNS-1274
  //
  // @Embedded
  // private Auditable auditable;
  //
  
  @CreatedBy
  private String createdBy;

  @CreatedDate
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdAt;

  @LastModifiedBy
  private String updatedBy;
  
  @LastModifiedDate
  @Temporal(TemporalType.TIMESTAMP)
  private Date updatedAt;

  // Equals and hashCode must behave consistently across all entity state transitions
  // See: https://vladmihalcea.com/the-best-way-to-implement-equals-hashcode-and-tostring-with-jpa-and-hibernate/

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Party))
      return false;

    Party other = (Party) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}

// https://vladmihalcea.com/14-high-performance-java-persistence-tips/

// https://google.github.io/styleguide/javaguide.html
// https://stackoverflow.com/questions/34241718/lombok-builder-and-jpa-default-constructor/35602246#35602246

/* 

IMPORTANT: Override toString, equals, and hashCode as described in these  documents.
- https://vladmihalcea.com/the-best-way-to-implement-equals-hashcode-and-tostring-with-jpa-and-hibernate/
- https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
- https://vladmihalcea.com/hibernate-facts-equals-and-hashcode/

*/

// @Builder.Default
// private String type = "Party";

// @GeneratedValue(strategy = GenerationType.AUTO)
// @Table(name = "Party")

// @Version
// private Long version;
