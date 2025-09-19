<h1 align="center">Flowable</h1>

## ❯ Introduction

The Flowable project provides a core set of open source business process engines that are compact and highly efficient. 
They provide a workflow and Business Process Management (BPM) platform for developers, system admins, and business users. 
Flowable runs on lightning-fast, tried and tested dynamic BPMN, DMN and CMMN engines, all written in Java.

## ❯ Application Architecture

The Flowable - Spring Boot integration has been developed together with the Spring committers.

See: [Flowable - Spring Boot](https://www.flowable.com/open-source/docs/bpmn/ch05a-Spring-Boot)

### Spring Initializr

We'll use [Spring Initializr](https://start.spring.io/) to bootstrap an application.

For example:

```
Project: Maven
Language: Java
Spring Boot: 3.5.5
Group: org.serendipity
Artifact: workflow
Name: Serendipity Work Service
Description: Use Flowable to implement a workflow engine with a REST API.
Package name: org.serendipity.workflow
Packaging: Jar
Java: 21
```

**Dependencies**

```
  <properties>
    <flowable.version>7.2.0</flowable.version>
  </properties>

  <dependencies>

    <dependency>
      <groupId>org.flowable</groupId>
      <artifactId>flowable-spring-boot-starter-rest</artifactId>
      <version>${flowable.version}</version>
    </dependency>

  </dependencies>
```

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
                ├── pom.xml             
            └── /workflow-service
                └── /src
                    └── /main
                        └── /java
                            └── /org.serendipity.work
                                ├── WorkflowServiceApplication.java                            
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

spring:
  datasource:
    username: admin
    password: secret
  main:
    banner-mode: off
  profiles:
    active: @spring.profiles.active@

management:
  endpoints:
    web:
      exposure:
        include: beans, env, health, info, metrics, flowable
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

### REST API Endpoints

???

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
* Spring docs: [Spring Data REST Reference Guide](https://docs.spring.io/spring-data/rest/docs/current-SNAPSHOT/reference/html/#reference)