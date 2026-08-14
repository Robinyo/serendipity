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

#### Application Properties

Convert the application's `application.properties` to yaml.

For example:

```
server:
  port: 8080

logging:
  level:
    root: INFO
    org.hibernate.SQL: INFO
    org.springframework.web: INFO

spring:
  data:
    rest:
      base-path: /api/party-service
  # jpa:
  #   show-sql: true
  datasource:
    username: admin
    password: secret
  jackson:
    deserialization:
      fail-on-unknown-properties: false
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

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.serendipity.party.type.PartyType;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "Party", indexes = @Index(name = "party_public_id_idx", columnList = "publicId"))
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Party {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceParty")
  @SequenceGenerator(name = "SequenceParty", allocationSize = 1)
  private Long id;

  @Builder.Default
  @Column(nullable = false, unique = true, updatable = false, length = 36)
  private String publicId = UUID.randomUUID().toString();

  @Builder.Default
  @Enumerated(EnumType.STRING)
  private PartyType type = PartyType.INDIVIDUAL;

  @Builder.Default
  private String legalEntityType = "";

  @Builder.Default
  private String displayName = "";

  @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(
    name = "PartyAddress",
    joinColumns = @JoinColumn(name = "partyId"),
    inverseJoinColumns = @JoinColumn(name = "locationId")
  )
  private Set<Address> addresses;

  @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(
    name = "PartyRole",
    joinColumns = @JoinColumn(name = "partyId"),
    inverseJoinColumns = @JoinColumn(name = "roleId")
  )
  private Set<Role> roles;

  @Embedded
  private Auditable audit;

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

#### @SequenceGenerator

Using a database sequence is the most efficient Hibernate identifier generation strategy, it also allows you to take 
advantage of the automatic JDBC batching mechanism.

See: [How to generate JPA entity identifier values using a database sequence](https://vladmihalcea.com/jpa-entity-identifier-sequence/)
See: [How to batch INSERT and UPDATE statements with Hibernate](https://vladmihalcea.com/how-to-batch-insert-and-update-statements-with-hibernate/)

#### Auditing in Spring Data JPA

You can keep track of changes made to JPA entities using Spring Data JPA auditing annotations: @EntityListeners, 
@Embedded, and @Embeddable.

See: [How to audit entity modifications using JPA annotations](https://vladmihalcea.com/how-to-audit-entity-modifications-using-the-jpa-entitylisteners-embedded-and-embeddable-annotations/)

#### equals() and hashCode()

An entity must be equal to itself across all JPA object states: transient, attached, detached, removed (as long as the 
object is marked to be removed, and it is still living on the Heap).

- We can’t use an auto-incrementing database id in the hashCode method since the transient and the attached object
  versions will no longer be located in the same hashed bucket.
- We can’t rely on the default Object equals and hashCode implementations since two entities loaded in two
  different persistence contexts will end up as two different Java objects, therefore breaking the all-states
  equality rule.

So, if Hibernate uses the equality to uniquely identify an Object, for its whole lifetime, we need to find the
right combination of properties satisfying this requirement.

See: [How to implement Equals and HashCode for JPA entities](https://vladmihalcea.com/hibernate-facts-equals-and-hashcode/)
See: [How to implement equals and hashCode using the JPA entity identifier](https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/)

### Service Layer

This layer (@Service) contains core business logic and orchestrates data access via repositories.

For example:

```
package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.exception.ResourceNotFoundException;
import org.serendipity.party.repository.IndividualRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class IndividualService {

  private final IndividualRepository repository;

  @Transactional(readOnly = true)
  public Page<Individual> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public Individual findByPartyPublicId(String publicId) {
    return repository.findByPartyPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Individual not found with id: " + publicId));
  }

  @Transactional(readOnly = true)
  public Page<Individual> findByNameFamilyNameStartsWith(final String name, Pageable pageable) {
    return repository.findByNameFamilyNameStartsWith(name, pageable);
  }

  @Transactional
  public Individual save(Individual individual) {
    log.debug("Saving Individual: {}", individual);
    return repository.save(individual);
  }

  @Transactional
  public Individual update(String publicId, Individual updatedIndividual) {
    log.debug("Updating Individual with publicId: {}", publicId);

    Individual existing = repository.findByPartyPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Individual not found with id: " + publicId));

    // 1. Basic & Name Information
    existing.setName(updatedIndividual.getName());
    existing.setJobTitle(updatedIndividual.getJobTitle());
    existing.setSex(updatedIndividual.getSex());
    existing.setGender(updatedIndividual.getGender());

    // 2. Contact Information
    existing.setEmail(updatedIndividual.getEmail());
    existing.setPhoneNumber(updatedIndividual.getPhoneNumber());
    existing.setFaxNumber(updatedIndividual.getFaxNumber());
    existing.setPreferredContactMethod(updatedIndividual.getPreferredContactMethod());

    // 3. Profile & Location
    existing.setPhotoUrl(updatedIndividual.getPhotoUrl());
    existing.setElectorate(updatedIndividual.getElectorate());

    // 4. Birth Details
    existing.setDateOfBirth(updatedIndividual.getDateOfBirth());
    existing.setPlaceOfBirth(updatedIndividual.getPlaceOfBirth());
    existing.setCountryOfBirth(updatedIndividual.getCountryOfBirth());

    // 5. Death Details
    existing.setDateOfDeath(updatedIndividual.getDateOfDeath());
    existing.setPlaceOfDeath(updatedIndividual.getPlaceOfDeath());
    existing.setCountryOfDeath(updatedIndividual.getCountryOfDeath());

    // 6. Relationship Status
    // existing.setRelationshipLifecycleStatus(updatedIndividual.getRelationshipLifecycleStatus());

    // 7. Update Party (if present)
    if (updatedIndividual.getParty() != null && existing.getParty() != null) {
      existing.getParty().setDisplayName(updatedIndividual.getParty().getDisplayName());
    }

    // 8. Child Collection (names): Clear and add to handle orphanRemoval properly
    if (updatedIndividual.getNames() != null) {
      existing.getNames().clear();
      updatedIndividual.getNames().forEach(existing::addIndividualName);
    }

    return repository.save(existing);
  }

  @Transactional
  public void deleteByPartyPublicId(final String id) {
    log.debug("Deleting Individual with publicId: {}", id);

    if (!repository.existsByPartyPublicId(id)) {
      throw new ResourceNotFoundException("Individual not found with id: " + id);
    }

    repository.deleteByPartyPublicId(id);
  }

}
```

#### Exception Handling

A `@ControllerAdvice` class with an `@ExceptionHandler` method can be used to handle `ResponseStatusException` globally, 
although Spring Boot typically handles `ResponseStatusException` out-of-the-box. 

The main purpose of a global handler for this specific exception type is often to customise the error response format to 
meet specific API requirements.

##### How Spring Handles ResponseStatusException
Spring's default mechanisms (specifically the `ResponseStatusExceptionResolver`) are designed to automatically process 
`ResponseStatusException` instances and translate them into appropriate HTTP responses with the correct status code and 
message. If you throw a `ResponseStatusException` in your controller or service layer, Spring will automatically use its 
properties to return a proper error response. 

While Spring handles `ResponseStatusException` automatically, you can implement a global exception handler using 
`@ControllerAdvice` and `@ExceptionHandler(ResponseStatusException.class)` to customise the error response format. 
This allows for a consistent, structured response across your application.

#### JPA Repositories

The primary interface in the Spring Data repository abstraction is `Repository`. 

Spring Data considers domain types (e.g., Party) to be entities, more specifically aggregates. So you will see the term 
"entity" used throughout the Spring documentation (and the terms "domain type" or "aggregate").

For example:

```
package org.serendipity.party.repository;

import org.serendipity.party.entity.Individual;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IndividualRepository extends JpaRepository<Individual, Long> {

  Optional<Individual> findByPartyPublicId(String publicId);

  Page<Individual> findByNameFamilyNameStartsWith(String name, Pageable pageable);

  boolean existsByPartyPublicId(String publicId);

  void deleteByPartyPublicId(String publicId);

}
```

### Controller Layer

This layer (@RestController) handles HTTP requests. It calls the service layer and is responsible for transforming the 
plain data into HATEOAS-compliant representations (EntityModel, CollectionModel) by adding relevant links.

### Representation model assembler

Code you write to instantiate a Model object should only set attributes and not populate links.

See: [Spring HATEOS Reference - Representation model assembler](https://docs.spring.io/spring-hateoas/docs/current/reference/html/#server.representation-model-assembler)

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

### How do you guarantee runtime consistency across layers

A successful build is a great milestone—especially in a multi-module project! 
However, Java compilation only guarantees syntax and typing correctness. It doesn't guarantee runtime consistency 
across your layers (e.g., matching controller endpoints, assembler logic, repository property traversals, and exception
handling). 

Here is a practical checklist and a set of verification techniques to ensure total consistency across your 
Controller -> Assembler -> Service -> Repository chain:

| Component                | URL                                                                                                                          | Description                                                                                                             |
|:-------------------------|:-----------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------|
| Controller <-> Assembler | Check that path variables in `@GetMapping("/individuals/{id}")` match the parameters expected in `createModelWithId(...)`.   | Self-links generated in HAL responses will point to broken or mismatched URLs.                                          |
| Service <-> Repository   | Ensure custom repository lookup methods (e.g., `findByPartyPublicId`) match what the Service layer calls.                    | Runtime `QueryCreationException` or `PropertyReferenceException` if property names don't map to entity fields.          |
| Entity Relationships     | Check bidirectional associations (`@OneToOne`, `@OneToMany`) and cascading options.                                          | `LazyInitializationException`, missing foreign keys, or cascading deletes dropping child records unexpectedly.          |
| Exception Handling       | Confirm that custom exceptions (like `ResourceNotFoundException`) thrown by services are handled by `@RestControllerAdvice`. | Unhandled exceptions will return default Spring `500 Internal Server Error` instead of clean `404 Not Found` responses. |

#### High-Yield Automated Testing Strategy

To catch hidden runtime issues automatically without manual testing, implement the following key test layers.

#### Architecture & Consistency Tests (ArchUnit)

If you want to enforce architectural rules (e.g., "Controllers should only talk to Services, Services should only talk 
to Repositories"), [ArchUnit](https://www.archunit.org/) checks this at test-time.

```
@AnalyzeClasses(packages = "org.serendipity.party")
public class ArchitectureTest {

  @ArchTest
  public static final ArchRule controllers_should_only_call_services =
      noClasses().that().resideInAPackage("..controller..")
          .should().accessClassesThat().resideInAPackage("..repository..");
}
```

#### Repository Unit Tests (@DataJpaTest)

Verify that Spring Data JPA can derive your queries (like `findByPartyPublicId`) against an in-memory database (H2) or 
test container.

```
@DataJpaTest
class IndividualRepositoryTest {

  @Autowired
  private IndividualRepository repository;

  @Test
  void shouldFindByPartyPublicId() {
    // Verifies entity mappings and Spring Data query derivation at startup
  }
}
```

#### Slice & Integration Tests (@WebMvcTest / @SpringBootTest)

Test that HATEOAS links are generated correctly in your JSON responses.

```
@WebMvcTest(IndividualController.class)
class IndividualControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void findById_ShouldReturnHalJsonWithSelfLink() throws Exception {
    mockMvc.perform(get("/individuals/{id}", "party-123")
            .accept(MediaTypes.HAL_JSON_VALUE))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.self.href").exists());
  }
}
```

#### Run Spring Integration Tests with Maven

To execute tests every time you build, run:

```
mvn clean verify
```

If you have integration tests configured with the `maven-failsafe-plugin`, `mvn verify` will spin up the Spring context, 
run all integration checks, and confirm complete runtime consistency before packaging!

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

### Spring HATEOS

* Spring docs: [Spring HATEOS](https://docs.spring.io/spring-hateoas/docs/current/reference/html/#fundamentals.link-relations)
