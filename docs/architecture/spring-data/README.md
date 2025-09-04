<h1 align="center">Spring Data</h1>

## ❯ Introduction

Spring Data JPA, part of the larger [Spring Data](https://spring.io/projects/spring-data)] family, makes it easy to 
implement JPA-based repositories.

## ❯ Application Architecture

Spring Data JPA helps you create and retrieve objects stored in a database by using [Spring Data REST](https://spring.io/projects/spring-data-rest).

Spring Data REST takes the features of [Spring HATEOAS](https://spring.io/projects/spring-hateoas) and [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
and automatically combines them together.

### Spring Initializr

We'll use [Spring Initializr](https://start.spring.io/) to bootstrap an application.

For example:

```
Project: Maven
Language: Java
Spring Boot: 3.5.5
Group: org.serendipity
Artifact: party
Name: Serendipity Party Service
Description: Use Spring Data REST to implement Serendipity's REST API.
Package name: org.serendipity.party
Packaging: Jar
Java: 21
```

**Dependencies**

Rest Repositories (Web): Exposing Spring Data repositories over REST via Spring Data REST.

Spring Data JPA (SQL): Persist data in SQL stores with Java Persistence API using Spring Data and Hibernate.

### Application Properties

Convert the application's `application.properties` to yaml.

For example:

```
server:
  port: 8080

logging:
  level:
    root: INFO
    org.flowable: INFO
    org.hibernate.SQL: WARN
    org.springframework.web: INFO
    reactor.netty.http.client.HttpClient: INFO

spring:
  data:
    rest:
      base-path: /api
  datasource:
    username: serendipity
    password: secret
  main:
    banner-mode: off
  profiles:
    active: @spring.profiles.active@
```

### Domain Model

We'll use Serendipity's Common Data Model to create our entities.

For example:

```
package org.serendipity.party.entity;

...

@Entity
public class Party {

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "SequenceParty")
  @SequenceGenerator(
    name = "SequenceParty",
    allocationSize = 1
  )
  private Long id;

  @Builder.Default
  @Enumerated(EnumType.STRING)
  private PartyType type = PartyType.INDIVIDUAL;

  @Builder.Default
  private String legalType = "";

  @Builder.Default
  private String displayName = "";

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinTable(
    name = "PartyAddress",
    joinColumns = @JoinColumn(name = "partyId"),
    inverseJoinColumns = @JoinColumn(name = "locationId")
  )
  private Set<Address> addresses;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinTable(
    name = "PartyRole",
    joinColumns = @JoinColumn(name = "partyId"),
    inverseJoinColumns = @JoinColumn(name = "roleId")
  )
  private Set<Role> roles;

  //
  // Spring Data audit annotations in nested (embeddable) classes isn't supported yet.
  // See: https://jira.spring.io/browse/DATACMNS-1274
  //
  // @Embedded
  // private Auditable auditable;
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

  // Equals and hashCode must behave consistently across all entity state transitions
  // See: https://vladmihalcea.com/the-best-way-to-implement-equals-hashcode-and-tostring-with-jpa-and-hibernate/

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Party))
      return false;

    Party other = (Party) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() { return 31; }

}
```

### JPA Repositories

The primary interface in the Spring Data repository abstraction is `Repository`. 

Spring Data considers domain types (e.g., Party) to be entities, more specifically aggregates. So you will see the term 
"entity" used throughout the Spring documentation (and the terms "domain type" or "aggregate").

For example:

```
package org.serendipity.party.repository;

import org.serendipity.party.entity.Party;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface PartyRepository extends PagingAndSortingRepository<Party, Long> {}
```

### REST API Endpoints

Spring Data REST will automatically expose the `PartyRepository` as a RESTful endpoint. By default, it will provide 
endpoints for CRUD operations on the `Party` entity. No additional configuration is needed to expose the repository.

### H2

In newer versions of the H2 database you don't need to explicitly configure the dialect in your `application.yml` file.

You should however set `globally_quoted_identifiers` to `true`.

For example:

```
spring:
  datasource:
    driver-class-name: org.h2.Driver
    url: jdbc:h2:mem:db;DB_CLOSE_DELAY=-1
  jpa:
    properties:
      hibernate:
        globally_quoted_identifiers: true
    hibernate:
      ddl-auto: create-drop
  h2:
    console:
      enabled: true
      path: /h2-console
      settings:
        trace: false
        web-allow-others: true
```

## ❯ References

### Build Tools

* Apache docs: [Maven](https://maven.apache.org/guides/index.html)

### Spring Boot

* Spring Boot docs: [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.5/maven-plugin)
* Spring Boot docs: [Create an OCI image](https://docs.spring.io/spring-boot/3.5.5/maven-plugin/build-image.html)
* Spring Boot docs: [OAuth2 Client](https://docs.spring.io/spring-boot/3.5.5/reference/web/spring-security.html#web.security.oauth2.client)
* Spring Boot docs: [Spring Boot Actuator](https://docs.spring.io/spring-boot/3.5.5/reference/actuator/index.html)

### Spring Data

* GitHub: [Spring Data JPA](https://github.com/spring-projects/spring-data-jpa)
* Spring docs: [JPA Core Concepts](https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html)
