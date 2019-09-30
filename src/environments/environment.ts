// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './models';

export const environment: Environment = {

  production: false,

  defaultLanguage: 'en-gb', // 'en-gb', 'de-ch'

  isDebugMode: true,

  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  },

  okta: {
    clientId: '',
    grantType: 'authorization_code',
    issuer: '',
    redirectUri: 'http://localhost:4200/authorization-code/callback',
    responseType: 'code',
    scope: ['openid', 'profile', 'email', 'phone', 'address', 'groups'],
    testing: {
      disableHttpsCheck: true
    }
  },

  auth0: {
    client_id: '',
    domain: '',
    redirect_uri: 'http://localhost:4200/authorization-code/callback',
    scope: 'openid profile email phone address'
  },

  storageUriPrefix: 'https://firebasestorage.googleapis.com/v0/b/',

  version: '1.0.0-beta.1',

  sentryDsn: ''

};

// https://github.com/PatrickJS/angular-starter/blob/master/src/environments/environment.ts

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
