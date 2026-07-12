package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.serendipity.party.type.PartyType;
import org.springframework.hateoas.RepresentationModel;

import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class PartyModel extends RepresentationModel<PartyModel> {

  private Long id;
  private PartyType type;
  // private LegalEntityType legalEntityType;
  private String legalType;
  private String displayName;
  private Set<AddressModel> addresses;
  private Set<RoleModel> roles;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof PartyModel))
      return false;

    PartyModel other = (PartyModel) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}

// https://docs.spring.io/spring-hateoas/docs/current/reference/html/#fundamentals.representation-models

// When using Hibernate, the IDENTITY generator is not a good choice since it disables JDBC batching.
// See: https://vladmihalcea.com/14-high-performance-java-persistence-tips/
// See: https://vladmihalcea.com/jpa-entity-identifier-sequence/

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
