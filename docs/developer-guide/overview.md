# Developer Guide

This guide covers everything you need to develop, build, and extend Serendipity.

## What is Serendipity?

Serendipity is an open source Customer Engagement Platform built with:

- **Angular 22** + **Angular Material (M3)** for the Progressive Web App
- **Spring Boot 4.0.1** + **Spring Cloud 2025.1.0** for backend services
- **Java 25** as the runtime
- **Keycloak** for OpenID Connect authentication and OAuth 2.0 authorisation
- **Camunda 8.9** for BPMN 2.0 workflow orchestration

## Architecture Overview

Serendipity follows a layered architecture:

```
┌───────────────────────────────────────────────────┐
│              Progressive Web App (PWA)            │
│    Angular 22 · Angular Material M3 · Leaflet     │
├───────────────────────────────────────────────────┤
│              Backend for Frontend (BFF)           │
│    Spring Boot 4.0.1 · Serves PWA · API proxy     │
├───────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌──────────────────────────┐  │
│  │ Party Service │  │    Identity Service      │  │
│  │   Accounts    │  │       (Keycloak))        │  │
│  │   Contacts    │  │    OIDC · OAuth 2.0      │  │
│  └───────────────┘  └──────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │       Camunda 8.9 (BPMN / DMN / Forms)      │  │
│  └─────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────┤
│                   PostgreSQL                      │
└───────────────────────────────────────────────────┘
```

## Repository Structure

```
serendipity/
├── frontend/                           # Angular workspace
│   └── projects/
│       ├── serendipity-pwa/            # The PWA application
│       ├── serendipity-auth-lib/       # Authentication library
│       ├── serendipity-components-lib/ # Reusable UI components
│       ├── serendipity-party-lib/      # Party (Accounts and Contacts) UI components
│       ├── serendipity-camunda-lib/    # Camunda integration library
│       ├── serendipity-workflow-lib/   # Workflow (Human Tasks) library
│       ├── serendipity-utils-lib/      # Shared utilities
│
├── backend/                            # Spring Boot workspace
│   └── modules/
│       ├── web-bff/                    # Backend for Frontend
│       └── party-service/              # Party microservice
│ 
├── docs/                               # Documentation (Markdown)
├── website/                            # Docusaurus site (this documentation)
└── docker-compose*.yml
```

## Get Started

1. [Set up your development environment](../get-started/environment) — install Node.js, Java 25, Maven, and mkcert
2. [Install and configure](../get-started/installation) — clone the repo and configure TLS