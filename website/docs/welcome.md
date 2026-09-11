import Logo from '@site/static/img/serendipity-logo.svg';

# Welcome

<div style={{ display: 'flex', justifyContent: 'center' }}>
  <Logo style={{ width: '400px', height: 'auto' }} alt="Logo" />
</div>

Serendipity is an open source toolkit for building performant, high-quality Customer Engagement applications.
Applications that can transform your organisation by connecting your customers, products, people and operations.

## Architecture

Serendipity is composed of the following components:

- **Progressive Web App** — an Angular 22 + Angular Material (M3) single-page application
- **Backend for Frontend (BFF)** — a Spring Boot 4.0.1 service that serves the PWA and proxies API requests
- **Core Services**
  - **Identity Service** — Keycloak, providing OpenID Connect authentication and OAuth 2.0 authorization
  - **Party Service** — a Spring Boot microservice managing leads, opportunities, accounts, and contacts
- **Orchestration Services**
  - **Human Tasks Service** — Camunda 8.9 for BPMN 2.0 workflow orchestration
- **Reporting Services**
  - **Report Service** — separate reporting infrastructure (see [js-docker](https://github.com/Robinyo/js-docker))

<br /> <br />

![Context Diagram](/context-diagram.png)


## Security

- **OpenID Connect** is used for authentication and **OAuth 2.0** for authorisation.
- **TLS** is used to encrypt data in transit and **AES** to encrypt data at rest.

## Getting Started

Follow the steps in the [Get Started](./get-started/overview) guide.

## Documentation

- [Developer Guide](./developer-guide/overview) — build management, architecture, and tools
- [Administration Guide](./administration-guide/overview) — Docker, Keycloak, PostgreSQL, pgAdmin
- [User Guide](user-guide/learn-the-basics) — navigate the PWA and understand the data
- [Concepts](./concepts/authentication) — authentication architecture and CQRS
- [Try, Install or Upgrade](./try-install-upgrade/try) — deployment scenarios
- [References](./references/case-management) — case management framework

## Screen Shots

### Home (Welcome) Page

![Home Page](/screen-shots/serendipity/home.png)

### Navigation

**Navigation Bar**

![Navigation Bar](/screen-shots/serendipity/navigation-bar.png)

**Command Bar**

![Command Bar](/screen-shots/serendipity/command-bar.png)

**Sidenav**

![Sidenav](/screen-shots/serendipity/sidenav.png)

### Customer Engagement

**Accounts**

![Accounts](/screen-shots/serendipity/accounts.png)

**Contacts**

![Contacts](/screen-shots/serendipity/contacts.png)

## Web-based Tooling

Serendipity uses [form-js](https://bpmn.io/) to render forms and [bpmn-js](https://bpmn.io/) to display BPMN 2.0 diagrams.

## License

GNU Affero General Public License v3.0 — see [LICENSE](/LICENSE) for details.
