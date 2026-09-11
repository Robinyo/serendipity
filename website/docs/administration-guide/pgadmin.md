# pgAdmin

You can use [pgAdmin](https://www.pgadmin.org/) to manage PostrgeSQL.

Navigate to the pgAdmin Login page: https://serendipity.localhost:5443

![Login to pgAdmin](./pgadmin-login.png)

Login using the PGADMIN_DEFAULT_EMAIL (admin@serendipity.org) and PGADMIN_DEFAULT_PASSWORD (secret) credentials.

You should see something like:

![Welcome Page](./pgadmin-welcome-page.png)

In the 'Quick Links' click on 'Add New Server':

<div class="text--center">
  <img src={require('./pgadmin-register-server-general-tab.png').default} alt="Register Server - General Tab"  width="600px"/>
</div>

<br />
Enter the Name (Serendipity Storage Service) and then click on the 'Connection' tab:

<div class="text--center">
  <img src={require('./pgadmin-register-server-connection-tab.png').default} alt="Register Server - Connection Tab"  width="600px"/>
</div>

<br />
Enter the Host name / address (serendipity-storage-service) and the Username (SERENDIPITY_STORAGE_SERVICE_USER=admin) 
and Password (SERENDIPITY_STORAGE_SERVICE_PASSWORD=secret), and the Maintenance database (serendipity) then click the 'Save' button:

:::tip

The 'Host name / address' field must match the value (e.g., serendipity-storage-service) specified in the project's <br />`docker-compose.yml`.

:::

## References

### pgAdmin

* pgAdmin: [Documentation](https://www.pgadmin.org/docs/pgadmin4/latest/index.html)
