<h1 align="center">Developer Documentation</h1>

<p align="center">
  <b>The goal of this guide is to help you build and run Serendipity.</b></br>
</p>

## ❯ Quick Start

Good tools make application development better and easier.

### Step 1. Set up the Development Environment 

You need to set up your development environment before you can do anything.

Open a terminal window and install [Node.js (and npm)](https://nodejs.org/en/download/) and [git](https://git-scm.com/) if they are not already on your machine.

> Verify that you are running at least Node.js version 8.x or greater and npm version 5.x or greater by running node -v and npm -v in a terminal/console window. Older versions produce errors, but newer versions are fine.

Then install the Angular CLI globally:

```
npm install -g @angular/cli
```

The [Angular CLI](https://cli.angular.io/) is a command line tool that you can use to create the scaffolding for a new project, add files to a project and perform a variety of common development tasks.

### Step 2. Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspaces
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity
cd serendipity
```

### Step 3: Launch OpenLDAP

To launch OpenLDAP:

```
# docker pull osixia/openldap

docker run --detach --name openldap \
  --publish 10389:389 \
  --publish 10636:636 \
  --volume ~/workspace/Robinyo/serendipity:/serendipity \
  --env LDAP_ORGANISATION="flowable" \
  --env LDAP_DOMAIN="flowable.org" \
  --env LDAP_ADMIN_PASSWORD="secret" \
  osixia/openldap:1.2.3
```

When you run the image it will create the organisation (flowable), create the domain (flowable.org) and set the LDAP administrator's password (secret).

Let's check and see:

```
docker exec openldap ldapsearch -x -H ldap://localhost -b dc=flowable,dc=org -D "cn=admin,dc=flowable,dc=org" -w secret
```

#### Update OpenLDAP 

LDIF, or the LDAP Data Interchange Format, is a text format for representing LDAP data and commands.

To update OpenLDAP:

```
# In the project directory: /serendipity

docker exec openldap ldapadd \
  -x -H ldap://localhost \
  -D "cn=admin,dc=flowable,dc=org" \
  -w secret \
  -f ./serendipity/flowable/flowable.ldif
```

[flowable.ldif](https://github.com/Robinyo/serendipity/blob/master/flowable/flowable.ldif) describes Flowable's users and groups.

You can also use an [LDAP Browser](https://directory.apache.org/apacheds/) to manage your directory:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/ldap-browser.png">
</p>

Network settings:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/ldap-network-parameters.png">
</p>

Authentication settings:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/ldap-authentication.png">
</p>

### Step 4: Launch Keycloak 

To launch Keycloak:

```
# docker pull jboss/keycloak

docker run -d --name keycloak \
  -p 10001:8080 \
  -v ~/workspace/Robinyo/serendipity:/serendipity \
  -e KEYCLOAK_USER=admin \
  -e KEYCLOAK_PASSWORD=secret \
  jboss/keycloak
```

When you run the image it will create the Master realm's Admin (admin) user and password (secret).
The Master realm should only be used to create and manage other realms.

#### Import from the Command Line

To [import](https://www.keycloak.org/docs/latest/server_admin/index.html#_export_import) from a (previously exported) file into your database:

```
docker exec -it keycloak /opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=100 \
  -Dkeycloak.migration.action=import \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.file=/serendipity/keycloak-export.json
```

When the import is complete use `Ctrl-C` to exit the (JBoss) WildFly Application Server.

#### Import from the Administration Console (optional)

**Note:** If you imported a file from the command line you do not have to complete this step.

Navigate to the Welcome page: http://localhost:10001 and then login to the Administration Console using the KEYCLOAK_USER (admin) and KEYCLOAK_PASSWORD (secret) credentials.

To create a new realm, click 'Add realm' from the Master drop-down menu:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/add-realm.png">
</p>

Enter a Name (development) and then click the 'Create' button.

Click 'Import' in the sidemenu and then select a (previously exported) file to import ([keycloak-export.json](https://github.com/Robinyo/serendipity/blob/master/keycloak/keycloak-export.json)):

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/partial-import.png">
</p>

Select 'Import from realm: development', 'If a resource exists: Skip' and then Click the 'Import' button.

It's only a partial import :( so we will need to use the Administration Console to:

* [Configure the realm's Login settings](https://robferguson.org/blog/2020/01/03/keycloak-flowable-and-openldap/)
* [Create a User Federation to OpenLDAP](https://robferguson.org/blog/2020/01/03/keycloak-flowable-and-openldap/)
* [Create Serendipity's Client (OAuth 2.0) scopes](https://robferguson.org/blog/2019/12/31/angular-oauth2-keycloak/)

#### Configure the Realm's Login settings

Click 'Realm Settings' in the sidemenu and then click on the 'Login' tab:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/realm-login-settings.png">
</p>

Check 'User registration' and 'Edit username'. Uncheck everything else and then click the 'Save' button.

#### Create a User Federation to OpenLDAP

To create a new User Federation click 'User Federation' in the sidemenu and then choose 'ldap' as the provider:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/user-federation.png">
</p>

Check 'Enabled' and 'Import Users' then select 'Edit Mode: WRITABLE' and check 'Sync Registrations' so that 
[user registrations](https://www.keycloak.org/docs/latest/server_admin/index.html#_user-registration) will be created in OpenLDAP.

Select 'Vendor: Other' and enter 'uid' for the 'Username LDAP attribute', the 'RDN LDAP attribute' and the 'UID LDAP attribute'.

You can use an [LDAP Browser](https://directory.apache.org/apacheds/) to check your [settings](https://github.com/Robinyo/serendipity/blob/master/keycloak/open-ldap-user-federation.txt).

**Note:** I'm using [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/) hence the need to use the special 
DNS name: `host.docker.internal`

#### Create Serendipity's Client (OAuth 2.0) scopes

Serendipity has four roles:

* Guest
* User
* Manager
* Administrator

Serendipity's REST API uses scopes to protect resources, for example:

* individual:post
* individual:get
* individual:patch
* individual:delete

To create a new [scope](https://www.keycloak.org/docs/latest/server_admin/index.html#_client_scopes) click 'Client Scopes' in the sidemenu and then click the 'Create' button:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/client-scope.png">
</p>

Enter a Name and then click the 'Save' button:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/individual-get-scope.png">
</p>

I created four scopes:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/scopes.png">
</p>

I [linked](https://www.keycloak.org/docs/latest/server_admin/index.html#_client_scopes_linking) the scopes with the client:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/optional-client-scopes.png">
</p>

I [linked](https://www.keycloak.org/docs/latest/server_admin/index.html#_client_scopes_linking) the `individual:get` scope with the `Guest` role and the `User` role:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/individual-get-assigned-roles.png">
</p>

I also linked the `individual:post` and the `individual:patch` scopes with the `User` role.

I [linked](https://www.keycloak.org/docs/latest/server_admin/index.html#_client_scopes_linking) the `individual:delete` scope with the `Manager` role:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/individual-delete-assigned-roles.png">
</p>

#### Export from the Command Line (optional)

To [export]((https://www.keycloak.org/docs/latest/server_admin/index.html#_export_import)) your database into a single JSON file:

```
docker exec -it keycloak /opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=100 \
  -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.file=/serendipity/keycloak-export.json
```

#### Keycloak-related Blog Posts 

* Rob Ferguson's blog: [Getting started with Keycloak](https://robferguson.org/blog/2019/12/24/getting-started-with-keycloak/)
* Rob Ferguson's blog: [Angular, OpenID Connect and Keycloak](https://robferguson.org/blog/2019/12/29/angular-openid-connect-keycloak/)
* Rob Ferguson's blog: [Angular, OAuth 2.0 and Keycloak](https://robferguson.org/blog/2019/12/31/angular-oauth2-keycloak/)
* Rob Ferguson's blog: [Keycloak, Flowable and OpenLDAP](https://robferguson.org/blog/2020/01/03/keycloak-flowable-and-openldap/)

### Step 5: Launch Flowable 

To launch the flowable/all-in-one image:

```
# docker pull flowable/all-in-one

docker run -d --name flowable \
  -p 8080:8080 \
  --env-file ./ldap-env.txt \
  flowable/all-in-one
```

We can use an environment file ([ldap-env.txt](https://github.com/Robinyo/serendipity/blob/master/ldap-env.txt)) to pass properties to the Docker container.

**Note:** The flowable/all-in-one [image](https://hub.docker.com/r/flowable/all-in-one) may take a minute or two to startup.

The image includes Flowable's web applications:

- Flowable Identity Management: http://localhost:8080/flowable-idm
- Flowable Modeler: http://localhost:8080/flowable-modeler
- Flowable Task: http://localhost:8080/flowable-task
- Flowable Admin: http://localhost:8080/flowable-admin

Let's check, launch the [Flowable Identity Management](http://localhost:8080/flowable-idm) web application and sign in using the default username: **flowable** and password: **test**

Click on the 'Privileges' tab and then click 'Access the REST API' in the sidemenu:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/flowable-idm-privileges.png">
</p>

You should see two users with access to the REST API: `flowable` and `flowable-rest`

Serendipity uses the `flowable-rest` user for HTTP Basic access authentication to Flowable's [REST API](https://flowable.com/open-source/docs/bpmn/ch15-REST/).

#### Launch Flowable SNAPSHOT Image (optional)

Follow the steps in this [post](https://robferguson.org/blog/2019/01/05/how-to-build-flowable/) to build a flowable/all-in-one SNAPSHOT image.

To launch the flowable/all-in-one SNAPSHOT image:

```
docker run -d --name flowable \
  -p 8080:8080 \
  --env-file ./ldap-env.txt \
  flowable/all-in-one:6.5.0.event-SNAPSHOT
```

#### Flowable-related Blog Posts 

* Rob Ferguson's blog: [Getting started with Flowable](https://robferguson.org/blog/2018/12/10/getting-started-with-flowable/)
* Rob Ferguson's blog: [Flowable's REST API - Part 1](https://robferguson.org/blog/2018/12/24/flowable-rest-api-part-1/)
* Rob Ferguson's blog: [Flowable's REST API - Part 2](https://robferguson.org/blog/2019/01/02/flowable-rest-api-part-2/)
* Rob Ferguson's blog: [Flowable's REST API - Part 3](https://robferguson.org/blog/2019/01/03/flowable-rest-api-part-3/)
* Rob Ferguson's blog: [How To: Build Flowable](https://robferguson.org/blog/2019/01/05/how-to-build-flowable/)
* Rob Ferguson's blog: [How To: Flowable and LDAP](https://robferguson.org/blog/2019/01/28/how-to-flowable-and-ldap/)
* Rob Ferguson's blog: [Keycloak, Flowable and OpenLDAP](https://robferguson.org/blog/2020/01/03/keycloak-flowable-and-openldap/)

### Step 6: Serve the application's API 

Follow the steps in the Serendipity API's [Quick Start](https://github.com/Robinyo/serendipity-api/blob/master/projects/express-typeorm/docs/developer.md) Guide.

### Step 7: Serve the application 

Go to the project directory, install the project's dependencies and launch the server:

```
# In the project directory: /serendipity

npm install

ng build utils && \
ng build serendipity-components && \
ng build auth && \
ng build auth-oidc && \
ng build auth-auth0 && \
ng build auth-okta && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build auth-local && \
ng build flowable && \
ng build sales

ng serve --proxy-config=proxy.conf.json --open
```

The ng serve command launches the server, watches your files, and rebuilds the app as you make changes to those files.

Using the --open (or just -o) option will open your browser on `http://localhost:4200/`

Register page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-register.png">
</p>

Login page:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/oidc-login.png">
</p>

![divider](../divider.png)

## ❯ Docker Commands

Docker CLI management commands start with `docker`, then a space, then the management category, then a space, and then 
the command. A flag with two dashes in front is the full name of the flag. A flag with one dash is a shortcut for the 
full flag name.

To list all running containers:

```
docker container ls
```

To check an environment variable inside your container:

```
docker exec [name] printenv [variable]
```

For example:

```
docker exec flowable printenv FLOWABLE_IDM_LDAP_ENABLED
```

To check the environment variables inside your container:

```
docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  [name] | grep [value]
```

For example:

```
docker inspect -f \
  '{{range $index, $value := .Config.Env}}{{println $value}}{{end}}' \
  flowable | grep FLOW
```

To print logs:

```
docker logs [name]
```

For example:

```
docker logs flowable
docker logs keycloak
docker logs openldap
```

To start a shell session inside your container that you can interact with through your terminal:

```
docker exec -it [name] /bin/bash
```

`-i` is short for `--interactive`. Keep STDIN open even if unattached.
`-t` is short for `--tty`. Allocates a [pseudo terminal](http://en.wikipedia.org/wiki/Pseudo_terminal) that connects your terminal with the container’s STDIN and STDOUT.

For example:

```
docker exec -it flowable sh
```

You can stop a container using the following command:

```
docker container stop [name]
```

For example:

```
docker container stop flowable
docker container stop keycloak
docker container stop openldap
```

You can remove a container using the following command:

```
docker container rm [name]
```

For example:

```
docker container rm flowable
docker container rm keycloak
docker container rm openldap
```

Where is your image? It’s in your machine’s local Docker image registry:

```
docker image ls
```

![divider](../divider.png)

## ❯ Build Management

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

### Development

To build the project:

```
ng build utils && \
ng build serendipity-components && \
ng build auth && \
ng build auth-oidc && \
ng build auth-auth0 && \
ng build auth-okta && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build auth-local && \
ng build flowable && \
ng build sales
```
       
To launch the project:

```
ng serve --proxy-config=proxy.conf.json
```

Navigate to:

```
http://localhost:4200/
```

The app will automatically reload if you change any of the source files.

During **development** we can use the [proxying](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md) support in webpack's dev server to highjack certain URIs and send them to a backend server:

```
ng serve --proxy-config=proxy.conf.json
```

proxy.conf.json:

```
{
  "/engine-rest": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug"
  },
  "/flowable-task": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Basic Zmxvd2FibGUtcmVzdDp0ZXN0"
    }
  },
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "logLevel": "debug"
  }
}
```

### Production

To update the project's version:

```
npm run version-update -- 1.0.0-beta.1
```

To build the project:

```
ng build utils && \
ng build serendipity-components && \
ng build auth && \
ng build auth-oidc && \
ng build auth-auth0 && \
ng build auth-okta && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build auth-local && \
ng build flowable && \
ng build sales
ng build --prod --source-map 
```

The build artifacts will be stored in the `dist/serendipity` directory. 

To launch the project using [http-server](https://github.com/indexzero/http-server):

```
http-server -p 4200 -c-1 dist/serendipity
```

**Note:** To reduce the possibility of conflicts and avoid serving stale content, test on a dedicated port (e.g., 5042) and disable caching.

Navigate to:

```
http://localhost:4200
```

### Webpack Bundle Analyzer

By default, NgModules are eagerly loaded, which means that as soon as the app loads, so do all the NgModules.
However, Angular also provides support for lazy-loading NgModules. Lazy loading helps keep initial bundle sizes smaller, 
which in turn helps decrease load times.

To help you visualise bundle sizes you can use the [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer).
 
For example ("target": "es5"):

```
ng build --prod --named-chunks --stats-json && ./node_modules/webpack-bundle-analyzer/lib/bin/analyzer.js ./dist/serendipity/stats.json
```

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/web-bundle-analyzer-es5.png">
</p>

For example ("target": "es2015"):

```
ng build --prod --named-chunks --stats-json && ./node_modules/webpack-bundle-analyzer/lib/bin/analyzer.js ./dist/serendipity/stats-es2015.json
```

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/web-bundle-analyzer-es2015.png">
</p>

#### AoT Don'ts

The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time
- Don’t use default exports
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

For more detailed guide on AoT's Do's and Don'ts refer to https://github.com/rangle/angular-2-aot-sandbox

### Firebase Hosting

The Serendipity [demo](https://serendipity-f7626.firebaseapp.com) utilises Firebase Hosting.

The Firebase Hosting configuration is located in the project's `environment.ts` and `environments.prod.ts`:

```
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  }
```

And, `firebase.json`:

```
{
  "hosting": {
    "public": "dist/serendipity",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

To launch the project locally using Firebase:

```
firebase serve
```
 
Navigate to:
 
```
http://localhost:5000
```

To deploy the project to Firebase Hosting:

```
firebase deploy
```

Navigate to:

```
https://serendipity-f7626.firebaseapp.com
```

**Note:** If you run into any issues when trying to deploy to Firebase Hosting, try:

```
firebase login --reauth
firebase list
```

### Authentication

* [auth](https://github.com/Robinyo/serendipity/tree/master/projects/auth) library
* [auth-local](https://github.com/Robinyo/serendipity/tree/master/projects/auth-local) library
* [auth-oidc](https://github.com/Robinyo/serendipity/tree/master/projects/auth-oidc) library
* [auth-auth0](https://github.com/Robinyo/serendipity/tree/master/projects/auth-auth0) library
* [auth-okta](https://github.com/Robinyo/serendipity/tree/master/projects/auth-okta) library

#### Authentication Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

//
// Auth libs
//

import { LocalAuthModule, authProviders } from 'auth-local';
// import { OidcAuthModule, authProviders } from 'auth-oidc';
// import { Auth0AuthModule, authProviders } from 'auth-auth0';
// import { OktaAuthModule, authProviders } from 'auth-okta';

@NgModule({
  imports: [
    BrowserModule,
    LocalAuthModule,
    // OidcAuthModule.forRoot(environment),
    // Auth0AuthModule.forRoot(environment),
    // OktaAuthModule.forRoot(environment),
    CoreModule,
    AppRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ AppComponent ],
  providers: [
    loggerProviders,
    authProviders,
    angularMaterialProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
``` 
 
### Code scaffolding

Run `ng generate component component-name` to generate a new component. 

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Project Assets

You use the assets array inside the build target in `angular.json` to list files or folders you want to copy as-is when building your project:

```
  "assets": [
    "src/apple-touch-icon-iphone-retina.png",
    "src/apple-touch-icon-iphone-retina-precomposed.png",
    "src/browserconfig.xml",
    "src/favicon.ico",
    "src/manifest.json",
    "src/assets",
    
    ...
  ]
```

### Library Assets

ng-packagr does not copy 'assets' (the files and folders in the `assets/` directory) to the `dist/` directory.

You can workaround this issue by updating the assets array inside the build target in `angular.json`, for example:

```
  "assets": [
   
    ....
    
      {
        "glob": "**/*",
        "input": "projects/auth-local/src/assets",
        "output": "/assets"
      },
      {
        "glob": "**/*",
        "input": "projects/sales/src/assets",
        "output": "/assets"
      },
      {
        "glob": "**/*",
        "input": "projects/dashboard/src/assets",
        "output": "/assets"
      }
  ]
```

### Source Control

Check in:

```
git add .
git commit -m "Updated the README.md file"
git push -u origin master
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

### WebStorm

To disable the 'Angular Language Service', go to WebStorm -> Preferences -> Languages & Frameworks -> TypeScript and clear the 'Angular Language Service' checkbox.

![divider](../divider.png)

## ❯ Resources

### Angular Resources

* Angular.io: [Quick Start Guide](https://angular.io/guide/quickstart)
* Angular.io: [Style Guide](https://angular.io/guide/styleguide)
* GitHub: [Angular, one framework for Mobile & Desktop](https://github.com/angular/angular)
* GitHub: [A curated list of awesome Angular resources](https://github.com/gdi2290/awesome-angular)
* GitHub: [Catalog of Angular 2+ Components & Libraries](https://github.com/brillout/awesome-angular-components)

### Angular CLI Resources

* GitHub: [Library support in the Angular CLI](https://github.com/angular/angular-cli/wiki/stories-create-library)
* Medium: [6 Best Practices & Pro Tips when using Angular CLI](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)
* Medium: [Compiling css in new Angular 6 libraries](https://medium.com/@Dor3nz/compiling-css-in-new-angular-6-libraries-26f80274d8e5)
* GitHub: [Project Assets](https://github.com/angular/angular-cli/wiki/stories-asset-configuration)

### Angular Component Libraries

* GitHub: [flex-layout](https://github.com/angular/flex-layout)
* GitHub: [angular-split](https://github.com/bertrandg/angular-split/)
* GitHub: [angular-gridster2](https://github.com/tiberiuzuld/angular-gridster2)
* GitHub: [highcharts-angular](https://github.com/highcharts/highcharts-angular)

### Angular Form Libraries

* GitHub: [ng-dynamic-forms](https://github.com/udos86/ng-dynamic-forms)
* GitHub: [ngx-formly](https://github.com/formly-js/ngx-formly)
* GitHub: [angular-schema-form (AngularJS) - Generate forms from a JSON schema](https://github.com/json-schema-form/angular-schema-form)
* GitHub: [ngx-schema-form - HTML form generation based on JSON Schema](https://github.com/guillotinaweb/ngx-schema-form)
* GitHub: [angular2-json-schema-form - Angular 2 JSON Schema Form builder](https://github.com/dschnelldavis/angular2-json-schema-form)
* form.io: [form.io - A Form and Data Management Platform](https://www.form.io/)

### Angular i18N

* GitHub: [ngx-translate](https://github.com/ngx-translate/core)

### Additional Angular Component Libraries

* GitHub: [Angular in-memory Web API](https://github.com/angular/in-memory-web-api)
* GitHub: [json-server](https://github.com/typicode/json-server)
* GitHub: [Hotel - A simple process manager for developers](https://github.com/typicode/hotel)

### Auth Resources

* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Additional Auth Resources

* Auth0's blog: [The Auth0 SPA JS SDK](https://auth0.com/blog/introducing-auth0-single-page-apps-spa-js-sdk/)
* Okta's blog: [Is the OAuth 2.0 Implicit Flow Dead?](https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-dead)

#### Auth0 Auth Libraries

* GitHub: [Auth0 Authentication for Single Page Applications with PKCE](https://github.com/auth0/auth0-spa-js)

#### Okta Auth Libraries

* GitHub: [Okta Auth JavaScript SDK](https://github.com/okta/okta-auth-js)

### Authorisation Servers

* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)

### CSS Grid Layout

* CSS Tricks: [A Complete Guide to CSS Grid Layout](https://css-tricks.com/snippets/css/complete-guide-grid/)
* Grid By Example: [CSS Grid Layout by Example](https://gridbyexample.com/learn/)

### Digital Identity Resources

* dta.gov.au: [Gatekeeper Public Key Infrastructure Framework](https://www.dta.gov.au/our-projects/digital-identity/gatekeeper-public-key-infrastructure-framework)
* dta.gov.au: [The Trusted Digital Identity Framework (TDIF)](https://www.dta.gov.au/our-projects/digital-identity/trusted-digital-identity-framework)

### Font Resources

* Chris Aston's blog: [How to preload Google Fonts using resource hints](https://ashton.codes/preload-google-fonts-using-resource-hints/)
* GitHub: [A Hassle-Free Way to Self-Host Google Fonts](https://google-webfonts-helper.herokuapp.com/fonts)
* GitHub: [Google Fonts Files](https://github.com/google/fonts)

### Free for Developers

* free-for.dev: [This is a list of software, services and other offerings that have free tiers for developers](https://free-for.dev/#/?id=free-fordev)

### Image Resources

* GitHub: [Essential Image Optimization](https://images.guide)

### Material Design Resources

* Material.io: [Material Design, make beautiful products, faster](https://material.io/)
* GitHub: [Material Design for Angular](https://github.com/angular/material2)
* GitHub: [Covalent - The Teradata UI Platform built on Angular Material](https://teradata.github.io/covalent/#/docs)
* GitHub: [NiFi Flow Design System](https://github.com/apache/nifi-fds)

### Sample Data

* Wikipedia: [List of political parties in Australia](https://en.wikipedia.org/wiki/List_of_political_parties_in_Australia)
* Parliament of Australia: [Mail Labels for Australian Senators](https://www.aph.gov.au/Senators_and_Members/Guidelines_for_Contacting_Senators_and_Members/Address_labels_and_CSV_files)
* Parliament of Australia: [Photographs of Senators](https://www.aph.gov.au/Senators_and_Members/Senators/Senators_photos)

### Web Developer Resources

* Google: [Web Fundamentals](https://developers.google.com/web)

![divider](../divider.png)
