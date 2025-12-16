package org.serendipity.party.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.serendipity.party.type.PartyType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.Set;;

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

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinTable(
    name = "PartyAddress",
    joinColumns = @JoinColumn(name = "partyId"),
    inverseJoinColumns = @JoinColumn(name = "locationId")
  )
  private Set<Address> addresses;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
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

  // An entity must be equal to itself across all JPA object states: transient, attached, detached, removed (as long as
  // the object is marked to be removed, and it is still living on the Heap).
  //
  // Therefore, we can conclude that:
  // - We can’t use an auto-incrementing database id in the hashCode method since the transient and the attached object
  //   versions will no longer be located in the same hashed bucket.
  // - We can’t rely on the default Object equals and hashCode implementations since two entities loaded in two
  //   different persistence contexts will end up as two different Java objects, therefore breaking the all-states
  //   equality rule.
  //
  // So, if Hibernate uses the equality to uniquely identify an Object, for its whole lifetime, we need to find the
  // right combination of properties satisfying this requirement.
  //
  // See: https://vladmihalcea.com/hibernate-facts-equals-and-hashcode/
  // See: https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Party))
      return false;

    Party other = (Party) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
