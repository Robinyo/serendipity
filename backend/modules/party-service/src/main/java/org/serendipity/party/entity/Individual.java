package org.serendipity.party.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Individual",
    indexes = { @Index(name = "individual_family_name_idx", columnList = "familyName", unique = false) })
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Individual {

  // An Individual is a person.
  // The Individual concept represents people about which an Enterprise wishes to maintain information.

  // Shared Primary Key pattern (@MapsId) between Address and Location.
  // No generator needed because @MapsId derives the ID straight from Location.
  @Id
  private Long id;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "partyId")
  @MapsId
  private Party party;

  @Embedded
  private Name name; // The Individual's principle name (legal name)

  // You cannot limit the size of a @OneToMany collection
  // See: https://vladmihalcea.com/the-best-way-to-map-a-onetomany-association-with-jpa-and-hibernate/

  // names is a small collection and always required whenever an Individual is loaded, so we fetch it EAGERLY

  @Builder.Default
  @OneToMany(mappedBy = "individual", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<IndividualName> names = new HashSet<>();

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

  public void addIndividualName(IndividualName individualName) {
    this.names.add(individualName);
    individualName.setIndividual(this);
  }

  public void removeIndividualName(IndividualName individualName) {
    this.names.remove(individualName);
    individualName.setIndividual(null);
  }
  
  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Individual))
      return false;

    Individual other = (Individual) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}

// citizenship
// residences

// private String relationshipLifecycleStatus;

// occupation
// positions
