<h1 align="center">Working with Keycloak</h1>

### Export and Import

#### Export

To export a realm into a single JSON file:

```
docker exec -it serendipity-identity-server /opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=100 \
  -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.realmName=development \
  -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
  -Dkeycloak.migration.file=/export/development-realm.json
```

When the export is complete use `Ctrl-C` to exit the session.

#### Import

To import a realm file place the (previously exported) file in the following location:

```
├── /spring-boot
    └── /server
        └── /services
            └── /keycloak
                └── /json
                    ├── development-realm.json
                    ├── production-realm.json
                ├── Dockerfile
                ├── keycloak.env
```

All the files in the `/json` directory will be copied to the Keycloak container: 

```
COPY json /tmp
```

If more than one realm file needs to be imported, a comma separated list of file names can be specified:

```
KEYCLOAK_IMPORT=/tmp/development-realm.json, /tmp/production-realm.json
```
 
**Reference:** [Server Administration Guide - Export and Import](https://www.keycloak.org/docs/latest/server_admin/index.html#_export_import)

### Getting Started

Follow the steps in the [Quick Start Guide](https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/developer/quick-start-guide.md.

Navigate to the Keycloak Welcome page: http://localhost:10001

Login to the Administration Console using the KEYCLOAK_USER (admin) and KEYCLOAK_PASSWORD (secret) credentials.

### Create a New Realm

The Master realm should only be used to create and manage other realms. To create a new realm, click 'Add realm' from the Master drop-down menu:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/master-drop-down-menu.png">
</p>

Enter a Name:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/add-realm.png">
</p>

Then click the 'Create' button:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/development-realm.png">
</p>

#### Login Page Settings

Click 'Realm Settings' in the sidemenu and then click on the 'Login' tab:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-2.0/blob/main/backend/docs/screen-shots/realm-settings-login.png">
</p>

Check 'User registration' and 'Remember me'. Uncheck everything else and then click the 'Save' button.

### Create a New Client

Every application that interacts with Keycloak is considered to be a client.

To create a new client in the `development` realm click 'Clients' in the sidemenu and then click the 'Create' button:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-api/blob/master/projects/spring-boot/docs/screen-shots/add-client.png">
</p>

Enter a Client ID and then click the 'Save' button:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity-api/blob/master/projects/spring-boot/docs/screen-shots/clients-settings.png">
</p>

Serendipity's Web BFF uses OpenID Connect to interact with Keycloak.
 
The 'Access Type' should be confidential. Check 'Standard Flow Enabled' and 'Direct Access Grants Enabled', enter a 
Valid Redirect URI (e.g., `http://localhost:8080/*`), enter a valid Web Origins (e.g., `*`) and then click the 'Save' button.

**Note:** Standard Flow is Keycloak's name for the OpenID Connect Authorization Code Flow.
