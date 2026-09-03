# CQRS

The design pattern that separates updates (writes/mutations) from queries (reads) is called Command Query 
Responsibility Segregation (CQRS).

## Core Concepts

- **Commands**: These handle updates, inserts, and deletes. They change the state of the system but typically do not 
return data.
- **Queries**: These retrieve data. They act purely as read operations and do not change the system state.

## Split-Responsibility Optimisation

In modern web architecture, this separation sees:

- **The Read Path (GET)**: Delivers a rich, multi-layered, hypermedia-driven object graph designed to give the UI 
everything it needs to paint screens and trace relationships.
- **The Write Path (PUT/POST)**: Accepts a strict, slim, flattened payload tailored exactly to user form boundaries, 
cutting out network bloat and preventing data pollution.

## The Unified Architecture Blueprint

Here is how data flows across the solution:

```
                      ┌──────────────────────────────┐
                      │         Angular PWA          │
                      └──────────────┬───────────────┘
                                     │
           GET reads rich JSON       │      PUT submits flat DTO
       (with _links & deep objects)  │  (no IDs, no links, pure state)
                                     ▼
                  ┌──────────────────────────────────────┐
                  │      Spring Boot BFF / Gateway       │
                  └──────────────────┬───────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │            Microservices             │
                  └──────────────────┬───────────────────┘
                                     │
             ┌───────────────────────┴───────────────────────┐
             ▼                                               ▼
       [READ PIPELINE]                                 [WRITE PIPELINE]
Controller returns HATEOAS Model                   Controller ingests flat DTO
    using HATEOAS Assemblers                      MapStruct merges fields to Entity
                                                 JPA flushes SQL safely to PostgreSQL

```