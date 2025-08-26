<h1 align="center">Working with pgAdmin</h1>

## ❯ pgAdmin

You can use [pgAdmin](https://www.pgadmin.org/) to manage PostrgeSQL.

Navigate to the pgAdmin Login page: https://hapi-fhir.au.localhost:5443

<p align="center">
  <img src="./pgadmin-login.png" alt="Login to pgAdmin"/>
</p>

Login using the PGADMIN_DEFAULT_EMAIL (admin@hapi-fhir.au) and PGADMIN_DEFAULT_PASSWORD (secret) credentials.

You should see something like:

<p align="center">
  <img src="./pgadmin-welcome-page.png" alt="Welcome Page"/>
</p>

In the 'Quick Links' click on 'Add New Server':

<p align="center">
  <img src="./pgadmin-register-server-general-tab.png" alt="Register Server - General Tab"/>
</p>

Enter the Name (HAPI FHIR PostgreSQL) and then click on the 'Connection' tab:

<p align="center">
  <img src="./pgadmin-register-server-connection-tab.png" alt="Register Server - Connection Tab"/>
</p>

Enter the Host name / address (postgres) and the PostgreSQL Username (POSTGRES_USER=admin) and Password (POSTGRES_PASSWORD=secret), 
the Maintenance database (hapi-fhir) then click the 'Save' button:

**Note:** The 'Host name / address' field must match the value (e.g., postgres) specified in the project's docker-compose.yml.

## ❯ References

### pgAdmin

* pgAdmin: [Documentation](https://www.pgadmin.org/docs/pgadmin4/latest/index.html)
