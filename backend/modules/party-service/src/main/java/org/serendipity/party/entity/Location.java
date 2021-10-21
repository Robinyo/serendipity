package org.serendipity.party.entity;

import lombok.*;
import org.serendipity.party.type.LocationType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Location {

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "SequenceLocation")
  @SequenceGenerator(
    name = "SequenceLocation",
    allocationSize = 1
  )
  private Long id;

  @Builder.Default
  @Enumerated(EnumType.STRING)
  private LocationType type = LocationType.ADDRESS;

  @Builder.Default
  private String displayName = "";
  
  @Temporal(TemporalType.TIMESTAMP)
  private Date fromDate;
  
  @Temporal(TemporalType.TIMESTAMP)
  private Date toDate;

  //
  // @Embedded
  // private Auditable audit;
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
  
  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Location))
      return false;

    Location other = (Location) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}

// https://github.com/GeoscienceAustralia/AS4590-codelists
// https://toolkit.data.gov.au/Publishing_your_data.html
