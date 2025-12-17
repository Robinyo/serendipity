package org.serendipity.party.entity;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.serendipity.party.type.LocationType;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

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

  private LocalDateTime fromDate;

  private LocalDateTime toDate;

  @Embedded
  private Auditable audit;
  
  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Location))
      return false;

    Location other = (Location) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}

// https://github.com/GeoscienceAustralia/AS4590-codelists
// https://toolkit.data.gov.au/Publishing_your_data.html


// @Temporal(TemporalType.TIMESTAMP)
// private Date fromDate;

// @Temporal(TemporalType.TIMESTAMP)
// private Date toDate;
