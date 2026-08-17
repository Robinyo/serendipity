package org.serendipity.party.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "identifier", indexes = @Index(name = "identifier_public_id_idx", columnList = "publicId"))
@SQLRestriction("to_date IS NULL OR to_date > CURRENT_DATE")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
// @Audited
@EntityListeners(AuditingEntityListener.class)
public class Identifier {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceIdentifier")
  @SequenceGenerator(name = "SequenceIdentifier", allocationSize = 1)
  private Long id;

  @Builder.Default
  @Column(nullable = false, unique = true, updatable = false, length = 36)
  private String publicId = UUID.randomUUID().toString();

  @Column(name = "type", nullable = false)
  private String type;

  @Column(name = "\"value\"", nullable = false)
  private String value;

  // @Column(name = "number", nullable = false)
  // private String number; // code: 85 087 326 690

  @Column(name = "register", nullable = false)
  private String register;

  private String lifecycleStatus;  // status: Active

  private LocalDate fromDate;

  private LocalDate toDate;

  @Embedded
  private Auditable audit;

}

// type -> name: ABN
// code: 85 087 326 690
// issuer: Australian Business Register