<h1 align="center">How to build a RESTful API with Spring Boot</h1>

## ❯ Introduction

This document provides a step-by-step guide to building a RESTful API using Spring Boot.

### Spring Initializr

We'll use [Spring Initializr](https://start.spring.io/) to create the scaffolding for a new project.

For example:

```
Project: Maven
Language: Java
Spring Boot: 3.5.5
Group: org.serendipity
Artifact: party
Name: Serendipity Party Service
Description: Use Spring Boot to build a RESTful API.
Package name: org.serendipity.party
Packaging: Jar
Java: 21
```

**Dependencies**

```
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

The `spring-boot-starter-data-jpa` is a convenient "starter" dependency provided by Spring Boot that simplifies the 
process of using the Java Persistence API (JPA) for database access. It automatically bundles and configures necessary 
libraries, eliminating the need for developers to manually manage individual dependencies and their compatible versions.

```
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
```

The `spring-boot-starter-data-rest` is a Spring Boot starter that provides a streamlined way to build hypermedia-driven 
REST web services on top of Spring Data repositories with minimal code. By simply including this dependency and 
defining your Spring Data repositories, it automatically generates RESTful endpoints for your domain entities, 
handling basic CRUD (Create, Read, Update, Delete) operations out of the box.

### Module Structure

A Maven multi-module project with Spring Boot refers to a project structure where a large application is broken down
into smaller, independent modules, all managed under a single parent Maven project. This approach offers several
benefits for developing scalable and maintainable Spring Boot applications.

For example:

```
├── /serendipity
    └── /backend
        ├── pom.xml (Parent POM)
        └── /modules
            └── /web-bff
                ├── pom.xml
            └── /party-service
                └── /src
                    └── /main
                        └── /java
                            └── /org.serendipity.party
                                └── /assembler
                                └── /controller
                                └── /entity
                                └── /model
                                └── /repository
                                └── /service                                
                                └── /type
                                ├── PartyServiceApplication.java   
                        └── /resources
                            ├── application.yml
                            ├── application-dev.yml
                            ├── application-prod.yml
                            ├── application-test.yml
                    └── /test
                ├── Dockerfile
                ├── pom.xml
```

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
    org.hibernate.SQL: INFO
    org.springframework.web: INFO
    reactor.netty.http.client.HttpClient: INFO

spring:
  data:
    rest:
      base-path: /api
  main:
    banner-mode: off
  profiles:
    active: @spring.profiles.active@

management:
  endpoints:
    web:
      exposure:
        include: beans, env, health, info, metrics
  endpoint:
    health:
      probes:
        enabled: true
      show-details: always
```

`application-dev.properties`:

```
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://postgres:5432/serendipity
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: create
```

### Domain Model

We'll use Serendipity's Common Data Model to create our entities.

The domain model uses standard JPA entities and [Lombok](https://projectlombok.org/features/).

For example:

```
package org.serendipity.party.entity;

...


@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
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

  // An entity must be equal to itself across all JPA object states: transient, attached, detached, removed (as long as
  // the object is marked to be removed, and it is still living on the Heap).
  //
  // Therefore, we can conclude that:
  // - We can’t use an auto-incrementing database id in the hashCode method since the transient and the attached object
  //   versions will no longer be located in the same hashed bucket.
  // - We can’t rely on the default Object equals and hashCode implementations since two entities loaded in two
  //   different persistence contexts will end up as two different Java objects, therefore breaking the all-states
  //   equality rule.
  //
  // So, if Hibernate uses the equality to uniquely identify an Object, for its whole lifetime, we need to find the
  // right combination of properties satisfying this requirement.
  //
  // See: https://vladmihalcea.com/hibernate-facts-equals-and-hashcode/
  // See: https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Party))
      return false;

    Party other = (Party) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

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

### Database Seeding

Database seeding in Spring Boot with JPA involves populating your database with initial data, which is useful for 
development, testing, or providing default application settings. Several methods can be employed for this purpose.

For example, Spring `ApplicationRunner` or `CommandLineRunner`.

- Implement ApplicationRunner or CommandLineRunner and override the run method.
- Inside the run method, inject your JPA repositories and use them to persist entities with initial data.
- These runners are executed after the Spring application context has been fully loaded, allowing access to all beans, including repositories.

### H2

he H2 Database Engine has a specific list of keywords or reserved words that cannot be used as identifiers (such as 
table names, column names, etc.) unless they are enclosed in double quotes. 

You should set `globally_quoted_identifiers` to `true` in order to avoid any 
[keyword](https://h2database.com/html/advanced.html?highlight=keyword&search=keywo#keywords) issues.

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
```

## ❯ References

### Build Tools

* Apache docs: [Maven](https://maven.apache.org/guides/index.html)

### REST

* GitHub: [RESTful API Design Guidelines](https://github.com/Robinyo/restful-api-design-guidelines)

### Spring

* Spring guides: [Building REST services with Spring](https://spring.io/guides/tutorials/rest)

### Spring Boot

* Spring Boot docs: [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.5/maven-plugin)
* Spring Boot docs: [Create an OCI image](https://docs.spring.io/spring-boot/3.5.5/maven-plugin/build-image.html)
* Spring Boot docs: [OAuth2 Client](https://docs.spring.io/spring-boot/3.5.5/reference/web/spring-security.html#web.security.oauth2.client)
* Spring Boot docs: [Spring Boot Actuator](https://docs.spring.io/spring-boot/3.5.5/reference/actuator/index.html)

### Spring Data

* GitHub: [Spring Data JPA](https://github.com/spring-projects/spring-data-jpa)
* Spring docs: [JPA Core Concepts](https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html)
* Spring docs: [Spring Data REST Reference Guide](https://docs.spring.io/spring-data/rest/docs/current-SNAPSHOT/reference/html/#reference)