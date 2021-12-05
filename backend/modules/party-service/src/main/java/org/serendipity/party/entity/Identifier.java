package org.serendipity.party.entity;

import lombok.*;
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

  @Temporal(TemporalType.TIMESTAMP)
  private Date fromDate; // start date: YYYYMMDD

  @Temporal(TemporalType.TIMESTAMP)
  private Date toDate; // end date: YYYYMMDD

  //
  // Spring Data audit annotations in nested (embeddable) classes isn't supported yet.
  // See: https://jira.spring.io/browse/DATACMNS-1274
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

}
