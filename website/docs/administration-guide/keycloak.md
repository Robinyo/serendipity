# Keycloak

## Keycloak Admin Console

Navigate to the Keycloak Admin Console:

```
https://serendipity-identity-service.localhost/admin
```

And sign in using the `SERENDIPITY_IDENTITY_SERVICE_ADMIN` (`temp-admin`) and `SERENDIPITY_IDENTITY_SERVICE_ADMIN_PASSWORD` (`secret`) credentials (supplied via the `.env` file):

![Keycloak Admin Console Sign In](/screen-shots/keycloak/keycloak-sign-in.png)

You should see something like:

![Keycloak Admin Console Welcome page](/screen-shots/keycloak/keycloak-welcome-page.png)

### Create a permanent Admin account

When you first start Keycloak you log in using the Keycloak bootstrap username and password. You should create a permanent Admin account in the master realm and delete the temporary one.

For example:

![Create permanent Admin account](/screen-shots/keycloak/keycloak-create-admin-user.png)

Don't forget to assign the admin role (role_admin) to the permanent admin account:

![Assign Admin role to the permanent Admin account](/screen-shots/keycloak/keycloak-assign-role-to-admin.png)

And to set a password:

![Set a password for the permanent Admin user](/screen-shots/keycloak/keycloak-set-password-for-admin.png)

Now sign out and then sign back in using your permanent Admin account credentials.

:::tip
After signing back in with the permanent admin account, the Admin Console loads as before but now the top-right user menu shows the permanent admin's name. The temporary bootstrap user no longer appears — delete it from **Users** in the master realm.
:::

### Create a Realm

A realm in Keycloak is analogous to a tenant. Each realm allows an administrator to create (isolated) groups of applications and users. Initially, Keycloak includes a single realm, the `master` realm.

The `master` realm should only be used to manage Keycloak.

To create a new realm, in the side menu click the dropdown menu and then click the 'Create realm' button:

![Keycloak Admin Console Create Realm](/screen-shots/keycloak/keycloak-create-realm.png)

Enter a 'Realm name' (e.g., `serendipity-dev`) and then click the 'Create' button.

:::tip
After creation the realm selector (top-left of the Admin Console) now includes `serendipity-dev` alongside `master`. Selecting it takes you to that realm's dashboard. The realm's **Realm settings** page is reachable from the side menu and the **Login** tab shows the default login options for the realm.
:::

To update a realm's settings, select 'Realm settings' in the side menu:

![Keycloak Admin Console Realm Settings](/screen-shots/keycloak/keycloak-realm-settings.png)

On the realm's settings 'Login' tab you can control the options for users, applications, roles, and groups in the current realm:

![Keycloak Admin Console Realm Settings](/screen-shots/keycloak/keycloak-realm-settings-login-tab.png)

:::info
In newer versions of Keycloak (v19+ using the modern React-based Admin Console), toggles on the Login tab auto-save immediately via API requests, which is why there is no main Save button.

The new Admin Console heavily caches UI state. A hard refresh (Cmd + Shift + R on Mac, Ctrl + F5 on Windows) often reveals that the setting did save on the backend even though the frontend UI showed it toggled back off.
:::

### Create a User

Verify that you are in the correct realm e.g., the Development Realm (`serendipity-dev`).

To create a new user, select 'Users' in the side menu and then click the 'Create new user' button:

![Keycloak Admin Console Create User](/screen-shots/keycloak/keycloak-create-user.png)

Enable the 'Email verified' slide toggle and enter an email address, a first name (i.e., given name), a last name (i.e., family name) and then click the 'Create' button.

A user needs a password to sign in.

To create a password, select the 'Credentials' tab and then click the 'Set password' button:

![Keycloak Admin Console Set Password](/screen-shots/keycloak/keycloak-set-password.png)

Enter a password, confirm the password and disable the 'Temporary' slide toggle (so that the user does not need to update the password the first time they sign in) and then click the 'Save' button.

Navigate to the Keycloak Account Console:

```
https://serendipity-identity-service.localhost:8443/realms/serendipity-dev/account
```

And sign in using the credentials you created:

![Keycloak Account Console Sign In](/screen-shots/keycloak/keycloak-account-console-sign-in.png)

You should see something like:

![Keycloak Account Console Personal Info](/screen-shots/keycloak/keycloak-account-console-personal-info.png)

### Create a Client

Verify that you are in the correct realm e.g., the Development Realm (`serendipity-dev`).

To create a new client, select 'Clients' in the side menu and then click the 'Create client' button:

![Keycloak Admin Console Create Client 1](/screen-shots/keycloak/keycloak-create-client-1.png)

Enter a 'Client ID' (e.g., `serendipity-web-bff`) and a 'Name' (e.g., `Serendipity Web BFF`) and then click the 'Next' button:

![Keycloak Admin Console Create Client 2](/screen-shots/keycloak/keycloak-create-client-2.png)

Enable the 'Client authentication' (i.e., OAuth 2.0 Confidential Client) slide toggle and the 'Standard flow' (i.e., OAuth 2.0 Authorization Code Flow) checkbox and then click the 'Next' button:

![Keycloak Admin Console Create Client 3](/screen-shots/keycloak/keycloak-create-client-3.png)

Enter a 'Valid redirect URI' (e.g., `https://serendipity.localhost/*`), a valid 'Web origins' (e.g., `*`) and then click the 'Save' button.

:::tip
After saving, Keycloak takes you to the client's **Settings** page. The **Client authentication** field shows `On` and **Standard flow** shows `On`. A **Client secret** is generated and visible in the **Credentials** tab — copy it now; Keycloak does not show it again. The client appears in the **Clients** list with the name you entered.
:::

### Configure the BFF

The BFF must be configured with the client credentials the Keycloak client just generated. The OAuth2 client registration lives in `backend/modules/web-bff/src/main/resources/application.yml`:

```yaml
oauth2:
  client:
    registration:
      keycloak:
        client-id: serendipity-web-bff
        client-secret: <the client secret Keycloak generated — copy it from the Credentials tab>
        scope:
          - openid
          - profile
          - email
        authorization-grant-type: authorization_code
        redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
    provider:
      keycloak:
        issuer-uri: https://serendipity-identity-service.localhost/realms/serendipity-dev
```

Each field must match what Keycloak has for the client:

| Application.yml field | What it must match |
|:---|:---|
| `client-id` | The Client ID set when creating the client (`serendipity-web-bff`) |
| `client-secret` | The Client Secret shown in the Keycloak **Credentials** tab after the client is created (Keycloak shows this only once — copy it immediately) |
| `authorization-grant-type: authorization_code` | Standard flow enabled (the 'Standard flow' checkbox in the client creation wizard) |
| `redirect-uri` | Must be a valid redirect URI registered on the client. Spring Security's default code endpoint is `/{baseUrl}/login/oauth2/code/{registrationId}`, so register `https://serendipity.localhost/login/oauth2/code/keycloak` as a valid redirect URI in Keycloak (the wildcard `https://serendipity.localhost/*` covers it) |
| `issuer-uri` | The realm URL (`https://serendipity-identity-service.localhost/realms/serendipity-dev`) |

The scopes (`openid`, `profile`, `email`) correspond to what the client is allowed to request; they must be valid scopes on the Keycloak realm's OIDC provider, but they are not separately configured on the client itself.

In production the `client-secret` should come from an environment variable or secret manager, not live in `application.yml` committed to source. The project's `.env` file is the intended place for environment-specific values during local development.

:::tip
When the BFF is running and the PWA navigates to `https://serendipity.localhost/`, the user is redirected to Keycloak's login endpoint (`https://serendipity-identity-service.localhost/realms/serendipity-dev/protocol/openid-connect/auth`). After entering credentials, Keycloak redirects back to `https://serendipity.localhost/login/oauth2/code/keycloak` with an authorization code. The BFF exchanges the code for an access token and the user is taken to the contacts page. A subsequent visit to the PWA does not require re-authentication — the `JSESSIONID` session cookie is still valid.
:::
#### Optional: enable OIDC global logout

If you want logging out of the PWA to also end the Keycloak session (so the user is signed out everywhere, not just from the BFF), register a **Valid post logout redirect URI** on the client in Keycloak:

```
https://serendipity.localhost/
```

This matches the `postLogoutRedirectUri` set on the BFF's `OidcClientInitiatedLogoutSuccessHandler` in the BFF's security configuration (`SecurityConfig.java`). Without it, the BFF can still log the user out locally, but the Keycloak session remains active and a subsequent login will not require re-authentication.

:::tip
When the user clicks **Logout** in the PWA, the browser calls `GET https://serendipity.localhost/logout`. The BFF invalidates the session and the `JSESSIONID` cookie, then redirects the browser to Keycloak's logout endpoint (`https://serendipity-identity-service.localhost/realms/serendipity-dev/protocol/openid-connect/logout`). If the post-logout redirect URI is registered on the client, Keycloak destroys the SSO session and redirects the browser back to `https://serendipity.localhost/`. Without the post-logout redirect URI registered, the browser is still redirected to `https://serendipity.localhost/` but the Keycloak session remains active — opening the PWA again logs the user back in without a credential prompt.
:::

### Export a realm

To export a realm, in the project's `/backend` directory, run

```bash
REALM_NAME=serendipity-dev docker compose run --rm serendipity-identity-service-export
```

:::info
The exported realm file is written to `backend/services/identity-service/export/`. Look for a file named `serendipity-dev-realm.json` there.
:::

## References

### Keycloak

* Keycloak docs: [Server Administration Guide - Importing and Exporting Realms](https://www.keycloak.org/server/importExport)
