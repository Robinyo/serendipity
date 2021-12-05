package org.serendipity.party.entity;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.Embeddable;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Embeddable
public class Auditable {
  
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

// Spring Data audit annotations in nested (embeddable) classes isn't supported yet.
// See: https://jira.spring.io/browse/DATACMNS-1274

// https://vladmihalcea.com/how-to-audit-entity-modifications-using-the-jpa-entitylisteners-embedded-and-embeddable-annotations/
// https://github.com/vladmihalcea/high-performance-java-persistence
