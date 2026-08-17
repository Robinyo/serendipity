package org.serendipity.party.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;
// import org.hibernate.envers.Audited;
import org.serendipity.party.type.LocationType;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "location", indexes = @Index(name = "location_public_id_idx", columnList = "publicId"))
@SQLRestriction("to_date IS NULL OR to_date > CURRENT_DATE")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
// @Audited
@EntityListeners(AuditingEntityListener.class)
public class Location {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceLocation")
  @SequenceGenerator(name = "SequenceLocation", allocationSize = 1)
  private Long id;

  @Builder.Default
  @Column(nullable = false, unique = true, updatable = false, length = 36)
  private String publicId = UUID.randomUUID().toString();

  @Builder.Default
  @Enumerated(EnumType.STRING)
  private LocationType type = LocationType.ADDRESS;

  @Builder.Default
  private String displayName = "";

  private LocalDate fromDate;

  private LocalDate toDate;

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
