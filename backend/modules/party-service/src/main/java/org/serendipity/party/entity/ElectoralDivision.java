package org.serendipity.party.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "ElectoralDivision",
    indexes = { @Index(name = "electoral_division_public_id_idx", columnList = "publicId"),
                @Index(name = "electoral_division_name_idx", columnList = "name") })
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ElectoralDivision {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceElectoralDivision")
  @SequenceGenerator(name = "SequenceElectoralDivision", allocationSize = 1)
  private Long id;

  @Builder.Default
  @Column(nullable = false, unique = true, updatable = false, length = 36)
  private String publicId = UUID.randomUUID().toString();

  @Column(name = "name", nullable = false)
  private String name;

  private String nameDerivation;

  private String state;

  private String area;

  private String locationDescription;

  private LocalDate dateGazetted;

  private String latitude;

  private String longitude;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof ElectoralDivision))
      return false;

    ElectoralDivision other = (ElectoralDivision) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
