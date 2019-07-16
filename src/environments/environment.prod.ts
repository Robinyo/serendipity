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
    issuer: '',
    redirectUri: 'http://localhost:4200/implicit/callback',
    scope: 'openid profile email phone address groups',
    responseType: 'id_token token',
    testing: {
      disableHttpsCheck: false
    }
  },

  storageUriPrefix: 'https://firebasestorage.googleapis.com/v0/b/',

  version: '1.0.0-beta.1',

  sentryDsn: ''

};

// https://github.com/PatrickJS/angular-starter/blob/master/src/environments/environment.prod.ts
