package org.serendipity.party.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "IndividualName", indexes = @Index(name = "individual_name_public_id_idx", columnList = "publicId"))
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class IndividualName {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceIndividualName")
  @SequenceGenerator(name = "SequenceIndividualName", allocationSize = 1)
  private Long id;

  @Builder.Default
  @Column(nullable = false, unique = true, updatable = false, length = 36)
  private String publicId = UUID.randomUUID().toString();

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "individualId", nullable = false)
  private Individual individual;

  @Column(name = "type", nullable = false)
  private String type;

  @Embedded
  private Name name;

  private LocalDateTime fromDate;

  private LocalDateTime toDate;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof IndividualName))
      return false;

    IndividualName other = (IndividualName) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
