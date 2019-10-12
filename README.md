<p align="center">
  <img src="./serendipity-logo.svg" alt="Serendipity" width="400"/>
</p>

<h1 align="center">Serendipity CRM</h1>

<p align="center">
  <b>Serendipity is an open source customer relationship management (CRM) solution.</b></br>
  <b>You can use it to transform your organisation by connecting your customers, products, people and operations.</b></br>
</p>

![divider](./divider.png)

## ❯ Features

- **AuthN & AuthZ** thanks to:
  - The [Local Auth](https://github.com/Robinyo/serendipity/tree/master/projects/auth-local) library which supports email/password registration and login and [JWT](https://jwt.io/) identity, access and refresh tokens
  - The [Auth0 Auth](https://github.com/Robinyo/serendipity/tree/master/projects/auth-auth0) library which supports Authorization Code flow with PKCE
  - The [Okta Auth](https://github.com/Robinyo/serendipity/tree/master/projects/auth-okta) library which supports Authorization Code flow with PKCE
- **Beautiful Code** thanks to Angular's [Style Guide](https://angular.io/guide/styleguide)
- **Contemporary UI** thanks to Angular [Material](https://material.angular.io/)
- **Custom Themes** see [themes](https://github.com/Robinyo/serendipity/tree/master/src/themes)
- **Dashboards and Dashboard Widgets** thanks to Angular [Gridster 2](https://github.com/tiberiuzuld/angular-gridster2) and [Highcharts](https://www.highcharts.com/)
- **Dynamic Forms** (take a look at the Dynamic Forms [documentation](https://github.com/Robinyo/serendipity/tree/master/projects/dynamic-forms))
- **Lazy Loading Angular Libraries** see this blog [post](https://robferguson.org/blog/2019/09/12/lazy-loading-angular-libraries/)
- **Dynamically Importing Static Libraries** see this [post](https://robferguson.org/blog/2019/09/23/dynamically-importing-highcharts/)
- **Internationalisation** thanks to [@ngx-translate](https://github.com/ngx-translate/core)

![divider](./divider.png)

## ❯ Demo

Firebase Hosting: [Serendipity](https://serendipity-f7626.firebaseapp.com)

**Note:** The demo hasn't been updated in a while as I am currently working on a containerised deployment that includes Serendipity's REST API. 

![divider](./divider.png)

## ❯ Quick Links

[Documentation, demos, and guides](docs/README.md)

![divider](./divider.png)

## ❯ Roadmap

Use TypeScript, Node.js, Express and TypeORM to build a [RESTful API](https://github.com/Robinyo/serendipity-api) for Serendipity:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/redoc.png">
</p>

![divider](./divider.png)

## ❯ Screen Shots

Auf Deutsch:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/dashboard-de.png">
</p>

Local Auth Login ([auth-local](https://github.com/Robinyo/serendipity/tree/master/projects/auth-local) library):

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/local-auth-login.png">
</p>

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/local-auth-register.png">
</p>

Auth0 Login ([auth-auth0](https://github.com/Robinyo/serendipity/tree/master/projects/auth-auth0) library)

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/auth0-login.png">
</p>

Okta Login ([auth-okta](https://github.com/Robinyo/serendipity/tree/master/projects/auth-okta) library)

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/okta-login.png">
</p>

Navigation Bar:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/navigation-bar.png">
</p>

Command Bar:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/command-bar.png">
</p>

Side Nav:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/sidenav-mode-over.png">
</p>

Activities:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/activities.png">
</p>

Contacts:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/contacts-web.png">
</p>

Contact Wizard:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/contact-wizard.png">
</p>

Contact:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/contact.png">
</p>

Dashboard:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/dashboard.png">
</p>

Dashboard Widgets:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/dashboard-widgets.png">
</p>

Dashboard - Fullscreen:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/dashboard-fullscreen.png">
</p>

Serendipity is a [progressive web application](https://developers.google.com/web/progressive-web-apps/) (PWA) with a RESTful API that can be hosted on premise or in the cloud.

You can customise and extend Serendipity using Angular, Angular libraries and Serendipity's [plugin](docs/developer.md) framework.

![divider](./divider.png)

## ❯ Resources

### Blog Posts

* Rob Ferguson's blog: [Getting started with Angular Material](https://robferguson.org/blog/2018/11/05/getting-started-with-angular-material/)
* Rob Ferguson's blog: [Angular Material: toolbar and sidenav](https://robferguson.org/blog/2018/11/10/angular-material-toolbar-and-sidenav/)
* Rob Ferguson's blog: [Getting started with Flowable](https://robferguson.org/blog/2018/12/10/getting-started-with-flowable/)
* Rob Ferguson's blog: [How To: Build Flowable](https://robferguson.org/blog/2019/01/05/how-to-build-flowable/)
* Rob Ferguson's blog: [How To: Flowable and LDAP](https://robferguson.org/blog/2019/01/28/how-to-flowable-and-ldap/)
* Rob Ferguson's blog: [Flowable's REST API - Part 1](https://robferguson.org/blog/2018/12/24/flowable-rest-api-part-1/)
* Rob Ferguson's blog: [Flowable's REST API - Part 2](https://robferguson.org/blog/2019/01/02/flowable-rest-api-part-2/)
* Rob Ferguson's blog: [Flowable's REST API - Part 3](https://robferguson.org/blog/2019/01/03/flowable-rest-api-part-3/)
* Rob Ferguson's blog: [Dashboards and Dashboard Widgets - Part 1](https://robferguson.org/blog/2019/06/22/dashboards-and-dashboard-widgets-part-1/)
* Rob Ferguson's blog: [Lazy Loading Angular Libraries](https://robferguson.org/blog/2019/09/12/lazy-loading-angular-libraries/)
* Rob Ferguson's blog: [Dynamically Importing Highcharts](https://robferguson.org/blog/2019/09/23/dynamically-importing-highcharts/)

### Digital Identity Resources

* dta.gov.au: [Gatekeeper Public Key Infrastructure Framework](https://www.dta.gov.au/our-projects/digital-identity/gatekeeper-public-key-infrastructure-framework)
* dta.gov.au: [The Trusted Digital Identity Framework (TDIF)](https://www.dta.gov.au/our-projects/digital-identity/trusted-digital-identity-framework)
* dta.gov.au: [TDIF: OpenID Connect 1.0 Profile](https://www.dta.gov.au/our-projects/digital-identity/trusted-digital-identity-framework/framework-documents#openid-connect-1-0-profile)
* dta.gov.au: [TDIF: Attribute Profile](https://www.dta.gov.au/our-projects/digital-identity/trusted-digital-identity-framework/framework-documents#openid-connect-1-0-profile)

![divider](./divider.png)
