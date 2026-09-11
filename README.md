<p align="center">
  <img src="./serendipity-logo.svg" alt="Serendipity" width="400"/>
</p>

<h1 align="center">Serendipity</h1>

<p>
  Serendipity is an open source toolkit for building performant, high-quality Customer Engagement applications.
  Applications that can transform your organisation by connecting your customers, products, people and operations.
</p>

**Built using Angular v22, Angular Material (M3) v22.1.1, Spring Boot v4.0.1,
Spring Cloud 2025.1.0 and Java 25.**

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

![Context Diagram](/website/static/context-diagram.png)


## Security

- **OpenID Connect** is used for authentication and **OAuth 2.0** for authorisation.
- **TLS** is used to encrypt data in transit and **AES** to encrypt data at rest.

## Get Started

Follow the steps in the [Get Started](https://robinyo.github.io/serendipity/docs/get-started/overview) guide.

## Documentation

- [Developer Guide](https://robinyo.github.io/serendipity/docs/developer-guide/overview) — build management, architecture, and tools
- [Administration Guide](https://robinyo.github.io/serendipity/docs/administration-guide/overview) — Docker, Keycloak, PostgreSQL, pgAdmin
- [User Guide](https://robinyo.github.io/serendipity/docs/users-guide/learn-the-basics) — navigate the PWA and understand the data
- [Concepts](https://robinyo.github.io/serendipity/docs/concepts/authentication) — authentication architecture and CQRS
- [Try, Install or Upgrade](https://robinyo.github.io/serendipity/docs/try-install-upgrade/try) — deployment scenarios
- [References](https://robinyo.github.io/serendipity/docs/references/case-management) — case management framework

## Screen Shots

### Home (Welcome) Page

![Home Page](https://github.com/Robinyo/serendipity/blob/main/website/static/screen-shots/serendipity/home.png)

### Navigation

**Navigation Bar**

![Navigation Bar](https://github.com/Robinyo/serendipity/blob/main/website/static/screen-shots/serendipity/navigation-bar.png)

**Command Bar**

![Command Bar](https://github.com/Robinyo/serendipity/blob/main/website/static/screen-shots/serendipity/command-bar.png)

**Sidenav**

![Sidenav](https://github.com/Robinyo/serendipity/blob/main/website/static/screen-shots/serendipity/sidenav.png)

### Customer Engagement

**Accounts**

![Accounts](https://github.com/Robinyo/serendipity/blob/main/website/static/screen-shots/serendipity/accounts.png)

**Contacts**

![Contacts](https://github.com/Robinyo/serendipity/blob/main/website/static/screen-shots/serendipity/contacts.png)

## Web-based Tooling

Serendipity uses [form-js](https://bpmn.io/) to render forms and [bpmn-js](https://bpmn.io/) to display BPMN 2.0 diagrams.

## License

GNU Affero General Public License v3.0 — see [LICENSE](/LICENSE) for details.
