<h1 align="center">Working with PostgreSQL</h1>

### Getting Started

Follow the steps in the [Quick Start Guide](https://github.com/Robinyo/serendipity-api/blob/master/projects/spring-boot/docs/developer/quick-start-guide.md).

You can use [pgAdmin](https://www.pgadmin.org/) to manage PostrgeSQL.

Navigate to the pgAdmin Welcome page: http://localhost:5050

Login using the PGADMIN_DEFAULT_EMAIL (admin@serendipity.org.au) and PGADMIN_DEFAULT_PASSWORD (secret) credentials:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/pgadmin-login.png">
</p>

Create Connection Wizard - General Tab:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/pgadmin-server-general-tab.png">
</p>

Create Connection Wizard - Connection Tab:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/pgadmin-server-connection-tab.png">
</p>

**Note:** The 'Host name / address' field must match the value (e.g., postgres) specified in the project's docker-compose.yml.

Dashboard - Schemas:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/pgamin-schemas.png">
</p>
