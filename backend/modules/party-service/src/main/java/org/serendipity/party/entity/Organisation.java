package org.serendipity.party.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

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

  @Temporal(TemporalType.DATE)
  private Date establishmentDate;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Organisation))
      return false;

    Organisation other = (Organisation) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
