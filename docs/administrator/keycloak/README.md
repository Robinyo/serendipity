<h1 align="center">Working with Keycloak</h1>

## ❯ Keycloak

### Getting Started

Navigate to the Keycloak Admin Console:

```
https://serendipity-identity-service.localhost:8443
```

And sign in using the `KEYCLOAK_USER` (temp-admin) and `KEYCLOAK_PASSWORD` (secret) credentials:

<p align="center">
  <img src="./keycloak-sign-in.png" alt="Keycloak Admin Console Sign In"/>
</p>

You should see something like:

<p align="center">
  <img src="./keycloak-welcome-page.png" alt="Keycloak Admin Console Welcome page"/>
</p>

**Note:** Keycloak will import the `serendipity-dev` realm (i.e., development-realm.json) when it starts up.

#### Create a Realm

A realm in Keycloak is analogous to a tenant. Each realm allows an administrator to create (isolated) groups of 
applications and users. Initially, Keycloak includes a single realm, the `master` realm. 

The `master` realm should only be used to manage Keycloak. 

To create a new realm, select 'Manage realms' in the sidemenu and then click the 'Create realm' button:

<p align="center">
  <img src="./keycloak-create-realm.png" alt="Keycloak Admin Console Create Realm"/>
</p>

Enter a 'Realm name' (e.g., `serendipity-dev`) and then click the 'Create' button.

To update a realm's settings, select 'Realm settings' in the sidemenu:

<p align="center">
  <img src="./keycloak-realm-settings.png" alt="Keycloak Admin Console Realm Settings"/>
</p>

#### Create a User

Verify that you are in the correct realm (e.g., the `serendipity-dev` realm).

To create a new user, select 'Users' in the sidemenu and then click the 'Create user' button:

<p align="center">
  <img src="./keycloak-create-user.png" alt="Keycloak Admin Console Create User"/>
</p>

Enable the 'Email' verified slide toggle and enter an email address, a first name (i.e., given name), a last name
(i.e., family name) and then click the 'Create' button.

A user needs a password to sign in. 

To create a password, select the 'Credentials' tab and then click the 'Set password' button:

<p align="center">
  <img src="./keycloak-set-password.png" alt="Keycloak Admin Console Set Password"/>
</p>

Enter a password and confirm the password, enable the 'Temporary' slide toggle (so that the user does not need to 
update the password the first time they sign in) and then click the 'Save' button.

#### Create a Client

...

### Permanent Admin Account

When you first start Keycloak you log in using the Keycloak bootstrap username and password.

You should create a permanent admin account in the master realm and delete the temporary one.

For example:

<p align="center">
  <img src="./keycloak-create-admin-user.png" alt="Create Admin user"/>
</p>

Don't forget to assign the admin role (role_admin) to the permanent admin account:

<p align="center">
  <img src="./keycloak-assign-role-to-admin.png" alt="Assign role to Admin user"/>
</p>

And to set a password:

<p align="center">
  <img src="./keycloak-set-password-for-admin.png" alt="Set a password for the Admin user"/>
</p>

### Importing and Exporting Realms

#### Import a Realm

Keycloak can import a realm when it starts up.

For example:

```
  keycloak.au.localhost:

    ...
    
    command:
      [
        'start-dev',
        '-Dkeycloak.migration.action=import',
        '-Dkeycloak.migration.provider=singleFile',
        '-Dkeycloak.migration.realmName=serendipity-dev',
        '-Dkeycloak.migration.strategy=OVERWRITE_EXISTING',
        '-Dkeycloak.migration.file=/import/development-realm.json',
      ]
      
    ...
      
    volumes:
      - '${PWD}:/import'
```

#### Export a Realm

Keycloak can export a realm when it starts up.

For example:

```
  keycloak.au.localhost:

    ...
    
    command:
      [
        'start-dev',
        '-Dkeycloak.migration.action=export',
        '-Dkeycloak.migration.provider=singleFile',
        '-Dkeycloak.migration.realmName=serendipity-dev',
        '-Dkeycloak.migration.usersExportStrategy=REALM_FILE',
        '-Dkeycloak.migration.file=/export/development-realm.json',
      ]
      
    ...
      
    volumes:
      - '${PWD}:/export'
```

## ❯ References

### Keycloak

* Keycloak docs: [Server Administration Guide - Importing and Exporting Realms](https://www.keycloak.org/server/importExport)
