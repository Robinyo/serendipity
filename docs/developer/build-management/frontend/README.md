<h1 align="center">Frontend Build Management</h1>

## ❯ Set up your Development Environment

You need to set up your development environment before you can do anything.

What you need:

* git
* Node.js
* Angular CLI

### Node.js

#### macOS

To install Node.js using Homebrew on macOS, follow these steps:

```
brew update
brew upgrade
brew install node
```

After the installation completes, you can verify that Node.js and npm (Node Package Manager, which comes bundled with Node.js) are installed correctly by checking their versions:

```
node -v
npm -v
```

### Angular CLI

Angular requires an active LTS or maintenance LTS version of Node.js. See Angular's [version](https://angular.dev/reference/versions) compatibility guide for more information.

To install the Angular CLI, open a terminal window and run the following command:

```
npm install -g @angular/cli
```

### Development

To build the frontend:

```
# In the project's /frontend directory

ng build --configuration="development" utils-lib && \
ng build --configuration="development" serendipity-pwa
```

To launch the project:

```
ng serve serendipity-pwa --open
```

### Aliases

To add support for aliases update the "paths" array in the `compilerOptions` section of `tsconfig.json`:

```
  "paths": {
    "@app/*": [
      "src/app/*"
    ],
    "@env/*": [
      "src/environments/*"
    ],

    ...
    
  }
```

### Project Assets

You use the assets array inside the build target in `angular.json` to list files or folders you want to copy as-is when building your project:

```
  "assets": [
    "projects/serendipity-pwa/src/favicon.ico",
    "projects/serendipity-pwa/src/assets",
    {
      "glob": "**/*",
      "input": "projects/serendipity-pwa/public"
    },
      
    ...
     
  ]
```

### Source Control

Check in:

```
git add .
git commit -m "Updated the README.md file"
git push -u origin main
```

Tag Format:

```
1.0.0-beta.1
```

To create a local tag on your current branch, run this:

```
git tag <tagname>
```

To push the local tags to GitHub:

```
git push origin --tags
```

or

```
git push origin <tag>
```

## ❯ References

### Angular

* Angular dev: [Angular CLI](https://angular.dev/cli)
* Angular dev: [Angular Style Guide](https://angular.dev/style-guide)
* Angular dev: [Multi-Project Workspace](https://angular.dev/reference/configs/file-structure#multiple-projects)
* Angular dev: [Multiple Project File Structure](https://angular.dev/reference/configs/file-structure#multiple-projects)

### Angular Material

* Material Angular dev: [Getting Started with Angular Material](https://material.angular.dev/guide/getting-started)
* GitHub: [Teradata Covalent](https://teradata.github.io/covalent/v11/#/)

### System Hardening

* Australian Signals Directorate: [Implementing Certificates, TLS, HTTPS and Opportunistic TLS](https://www.cyber.gov.au/resources-business-and-government/maintaining-devices-and-systems/system-hardening-and-administration/web-hardening/implementing-certificates-tls-https-and-opportunistic-tls)
* Cloudflare docs: [Cipher suites recommendations](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/cipher-suites/recommendations/)

### OAuth 2.0

* IETF: [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
* IETF: [OAuth 2.0 Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693)
* IETF: [The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
* IETF: [Resource Indicators for OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc8707)
* IETF: [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
* IETF: [JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens](https://datatracker.ietf.org/doc/html/rfc9068)
* IETF: [OAuth 2.0 Dynamic Client Registration Protocol](https://datatracker.ietf.org/doc/html/rfc7591)
* IETF: [OAuth 2.0 for Browser-Based Applications](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)
* Spring docs: [Implementation Guidelines for Browser-Based Applications](https://github.com/spring-projects/spring-authorization-server/issues/297#issue-896744390)

### Keycloak

* Keycloak docs: [Configuring Keycloak for production](https://www.keycloak.org/server/configuration-production)
* Keycloak docs: [Configuring TLS](https://www.keycloak.org/server/enabletls)
* Keycloak docs: [Configuring trusted certificates](https://www.keycloak.org/server/keycloak-truststore)
* Keycloak docs: [Configuring the hostname](https://www.keycloak.org/server/hostname)
* Keycloak docs: [Using a reverse proxy](https://www.keycloak.org/server/reverseproxy)
* Keycloak docs: [Running Keycloak in a container](https://www.keycloak.org/server/containers)
* Keycloak docs: [Migrating to the Quarkus distribution](https://www.keycloak.org/migration/migrating-to-quarkus)
* Keycloak docs: [Upgrading Guide - 26.1.0](https://www.keycloak.org/docs/latest/upgrading/)
* Keycloak docs: [Authorization Services Guide](https://www.keycloak.org/docs/latest/authorization_services/index.html)

### Keycloak-based  Development

* GitHub: [Keycloak Project Example](https://github.com/thomasdarimont/keycloak-project-example)
* GitHub: [Awesome Keycloak](https://github.com/thomasdarimont/awesome-keycloak)

### Keycloak Support

* Google Group: [Keycloak User](https://groups.google.com/g/keycloak-user)
* Google Group: [Keycloak Dev](https://groups.google.com/g/keycloak-dev)

### Nginx

* Nginx docs: [NGINX SSL Termination](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)

### Additional Resources

* GitHub: [Checking for existing SSH keys](https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys)
* GitHub: [Generating a new SSH key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
* GitHub: [Adding a new SSH key to your GitHub account](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
* GitHub: [Testing your SSH connection](https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection)
* GitHub: [Switching remote URLs from HTTPS to SSH](https://docs.github.com/en/github/using-git/changing-a-remotes-url#switching-remote-urls-from-https-to-ssh)
