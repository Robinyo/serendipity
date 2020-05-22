<h1 align="center">Build Management</h1>

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
ng serve
```

Navigate to:

```
http://localhost:4200/
```

The app will automatically reload if you change any of the source files.

During **development** we can use the [proxying](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md) 
support in webpack's dev server to highjack certain URIs and send them to a backend server:

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
