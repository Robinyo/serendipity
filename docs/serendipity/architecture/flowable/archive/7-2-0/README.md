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

flowable:
  process:
    servlet:
      path: /api/workflow-service/process-api
  cmmn:
    servlet:
      path: /api/workflow-service/cmmn-api
  dmn:
    servlet:
      path: /api/workflow-service/dmn-api
  idm:
    servlet:
      path: /api/workflow-service/idm-api
  rest:
    app:
      authentication-mode: any-user

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

### Identity management

By default, the IDM engine is initialised and started when the Flowable engine is started. 
The idm-engine manages its own database schema and the following entities:

- User and UserEntity, the user information.
- Group and GroupEntity, the group information.
- MembershipEntity, the memberships of users in groups
- Privilege and PrivilegeEntity, a privilege definition (for example used for controlling access to the UI apps, such as the Flowable Modeler and Flowable Task app)
- PrivilegeMappingEntity, linking a user and/or group to a privilege
- Token and TokenEntity, an authentication token used by the UI apps

The default IDM engine configurator can also be overridden to initialise the IDM Engine in a custom way. A good example 
is the LDAPConfigurator implementation which overrides the default IDM engine to use a LDAP server instead of the 
default IDM database tables.

See: [IDM](https://www.flowable.com/open-source/docs/bpmn/ch11-IDM)

### REST API

#### General Flowable REST principles

The REST API uses JSON format and is built upon the [Spring MVC](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html).

#### Authentication and Authorization

The Open Source version of Flowable provides basic support for **users**, **groups** and memberships which are defined in the Flowable database.
There is also support for LDAP integration.

All REST-resources require a valid user with the `rest-access-api` privilege to be authenticated by default.

A default user that can access the REST API can be configured by settings the following properties:

```
flowable.rest.app.admin.user-id=rest-admin
flowable.rest.app.admin.password=test
flowable.rest.app.admin.first-name=Rest
flowable.rest.app.admin.last-name=Admin
```

When the REST app boots up, the user is created if it doesn’t exist or fetched otherwise. This user will be given the 
`access-rest-api` privilege which is needed by default to access the REST API. 

If the `flowable.rest.app.admin.user-id` is not set, no users or privileges will be created.

Basic HTTP access authentication is used, so you should always include a `Authorization: Basic` when performing requests.

For example:

```
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('username:password')
  }),
  params: null
};
```

If any valid user should be able to call the REST API, the `flowable.rest.app.authentication-mode` can be set to `any-user`.

See: [REST API](https://www.flowable.com/open-source/docs/bpmn/ch14-REST)
See: [Flowable Default Properties](https://github.com/flowable/flowable-engine/blob/main/modules/flowable-app-rest/src/main/resources/flowable-default.properties)

### LDAP

Flowable offers an out-of-the-box solution for configuring how Flowable should connect with an LDAP system.

See: [LDAP](https://www.flowable.com/open-source/docs/bpmn/ch16-Ldap)

## ❯ References

### Build Tools

* Apache docs: [Maven](https://maven.apache.org/guides/index.html)

### Spring Boot

* Spring Boot docs: [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.5.5/maven-plugin)
* Spring Boot docs: [Create an OCI image](https://docs.spring.io/spring-boot/3.5.5/maven-plugin/build-image.html)
* Spring Boot docs: [OAuth2 Client](https://docs.spring.io/spring-boot/3.5.5/reference/web/spring-security.html#web.security.oauth2.client)
* Spring Boot docs: [Spring Boot Actuator](https://docs.spring.io/spring-boot/3.5.5/reference/actuator/index.html)
 
### Flowable

* Flowable docs: [REST API](https://www.flowable.com/open-source/docs/bpmn/ch14-REST)
* GitHub: [Flowable Releases](https://github.com/flowable/flowable-engine/releases)
* GitHub: [Flowable Default Properties](https://github.com/flowable/flowable-engine/blob/main/modules/flowable-app-rest/src/main/resources/flowable-default.properties)

### Activiti

* Activiti docs: [Users Guide](https://www.activiti.org/userguide/#_introduction)
* Activiti docs: [Eclipse Designer](https://www.activiti.org/userguide/#activitiDesigner)
* GitHub: [ng2-components](https://github.com/Alfresco/alfresco-ng2-components)
