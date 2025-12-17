package org.serendipity.party.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Identifier {

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "SequenceIdentifier")
  @SequenceGenerator(
    name = "SequenceIdentifier",
    allocationSize = 1
  )
  private Long id;

  @Column(name = "type", nullable = false)
  private String type; // name: ABN

  @Column(name = "value", nullable = false)
  private String value; // code: 85 087 326 690

  @Column(name = "register", nullable = false)
  private String register; // issuer: Australian Business Register

  private String lifecycleStatus;  // status: Active

  // @Temporal(TemporalType.TIMESTAMP)
  // private Date fromDate; // start date: YYYYMMDD
  private LocalDateTime fromDate;

  // @Temporal(TemporalType.TIMESTAMP)
  // private Date toDate; // end date: YYYYMMDD
  private LocalDateTime toDate;

  @Embedded
  private Auditable audit;

}

// import jakarta.persistence.Temporal;
// import jakarta.persistence.TemporalType;
