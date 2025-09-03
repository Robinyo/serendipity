<h1 align="center">Spring Data</h1>

## ❯ Introduction

Spring Data JPA, part of the larger [Spring Data](https://spring.io/projects/spring-data)] family, makes it easy to 
implement JPA-based repositories.

## ❯ Application Architecture

Spring Data JPA helps you create and retrieve objects stored in a database by using [Spring Data REST](https://spring.io/projects/spring-data-rest).

Spring Data REST takes the features of [Spring HATEOAS](https://spring.io/projects/spring-hateoas) and [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
and automatically combines them together.

### Spring Initializr

We'll use [Spring Initializr](https://start.spring.io/) to bootstrap the application.

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
