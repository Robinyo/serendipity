import { enableProdMode } from '@angular/core';

import { Environment } from './models';

enableProdMode();

export const environment: Environment = {

  production: true,

  defaultLanguage: 'en-GB',

  isDebugMode: false,

  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  },

  oidc: {
    clientId: '',
    grantType: 'authorization_code',
    issuer: '',
    redirectUri: 'http://localhost:4200/authorization-code/callback',
    responseType: 'code',
    scope: 'openid profile email phone address groups',
    testing: {
      disableHttpsCheck: true
    }
  },

  storageUriPrefix: 'https://firebasestorage.googleapis.com/v0/b/',

  version: '1.0.0-beta.1',

  sentryDsn: ''

};

// https://github.com/PatrickJS/angular-starter/blob/master/src/environments/environment.prod.ts
