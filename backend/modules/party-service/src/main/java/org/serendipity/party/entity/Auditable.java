package org.serendipity.party.entity;

import jakarta.persistence.Embeddable;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Embeddable
public class Auditable {

  @CreatedDate
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;

  @CreatedBy
  private String createdBy;

  @LastModifiedBy
  private String updatedBy;

}

// https://medium.com/@sibinraziya/how-to-implement-auditing-in-spring-data-jpa-60be8193c3fd

// https://vladmihalcea.com/how-to-audit-entity-modifications-using-the-jpa-entitylisteners-embedded-and-embeddable-annotations/
// https://github.com/vladmihalcea/high-performance-java-persistence

/*

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

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

*/

/*

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

  //
  // Spring Data audit annotations in nested (embeddable) classes isn't supported yet.
  // See: https://jira.spring.io/browse/DATACMNS-1274
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

*/