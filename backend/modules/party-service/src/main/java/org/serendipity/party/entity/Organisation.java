package org.serendipity.party.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(indexes = { @Index(name = "ORGANISATION_NAME_INDEX", columnList = "name", unique = false) })
public class Organisation {

  // An Organisation usually consists of a number of individuals or groups bound by a common purpose.
  // The Organisation concept represents companies and other type’s of organisations about which an Enterprise wishes
  // to maintain information.

  @Id
  private Long id;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "partyId")
  @MapsId
  private Party party;

  // @OrderColumn
  private String name;

  private String email;

  private String phoneNumber;

  private LocalDateTime establishmentDate;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Organisation))
      return false;

    Organisation other = (Organisation) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}

// @Temporal(TemporalType.DATE)
// private Date establishmentDate;
