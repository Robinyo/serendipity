<h1 align="center">Working with PostgreSQL</h1>

## ❯ PostgreSQL

PostgreSQL has very strict, unique behaviors regarding letter casing, which directly shapes its community best 
practices. Unlike some other databases, PostgreSQL internally folds all unquoted identifiers (table names, column names,
index names) to lowercase by default. 

If you write CREATE TABLE Party in PostgreSQL, it silently creates party in lowercase. 
If you use CamelCase, you are forced to wrap everything in double quotes ("Party") in every single raw SQL query you 
write forever, which becomes a major headache

### General Rules for All PostgreSQL Objects
- **Use strictly lowercase**. Avoid uppercase or CamelCase entirely.
- **Use snake_case** to separate words. Never use spaces or hyphens.
- **Keep names under 63 bytes**. PostgreSQL truncates any identifier longer than 63 characters, which can break 
  automatically generated names.

### Table Naming Conventions
- **Use singular nouns for data tables** (e.g., party, individual, organisation, address, electoral_division). 
- **Use snake_case for link/join tables**. For many-to-many join tables, join the two parent table names together in 
  alphabetical order or logical relationship flow (e.g., party_address or party_role).

### Column Naming Conventions
- **Use singular nouns** (e.g., display_name, legal_type, public_uuid).
- **Foreign Keys**: Use the pattern [referenced_table_singular]_id. For example, a foreign key referencing the parties 
  table should be named party_id.

## ❯ Spring Boot

n Spring Boot, the database naming strategy is defined in `application.yml` configuration file.
Spring Boot divides this configuration into two distinct Hibernate naming layers:
- **Implicit Naming Strategy**: Dictates how Hibernate determines a column name when you do not explicitly use the 
  @Column(name = "...") annotation.
- **Physical Naming Strategy**: Takes the final name from the implicit strategy and transforms it into the actual 
  physical database name (e.g., converting camelCase to snake_case).

For example:

```
spring:
  jpa:
    hibernate:
      naming:
        implicit-strategy: org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy
        physical-strategy: org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy
```

### What Spring Boot's Default Configuration Does
By default, Spring Boot automatically applies the **SpringPhysicalNamingStrategy**. This means that even if your Java 
fields are camelCase or PascalCase to match your Angular frontend requirements, Spring Boot translates them behind the 
scenes into PostgreSQL-friendly lowercase snake_case formats.

- **Java Entity Field**: publicUuid or PublicUuid
- **PostgreSQL Column Created**: public_uuid
- **Java Entity Class Name**: PartyAddress
- **PostgreSQL Table Created**: party_address

## ❯ References

### PostgreSQL

* PostgreSQL: [Documentation](https://www.postgresql.org/docs/current/index.html)
