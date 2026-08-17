package org.serendipity.party.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
// import org.hibernate.envers.Audited;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "individual_name", indexes = @Index(name = "individual_name_public_id_idx", columnList = "publicId"))
@SQLRestriction("to_date IS NULL OR to_date > CURRENT_DATE")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
// @Audited
@EntityListeners(AuditingEntityListener.class)
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

  private LocalDate fromDate;

  private LocalDate toDate;

  @Embedded
  private Auditable audit;

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
