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
    code_challenge: '',
    code_challenge_method: 'S256',
    issuer: '',
    redirectUri: 'http://localhost:4200/authorization-code/callback',
    responseType: 'code',
    scope: 'openid profile email phone address groups',
    state: 'state-8600b31f-52d1-4dca-987c-386e3d8967e9',
    testing: {
      disableHttpsCheck: true
    }
  },

  storageUriPrefix: 'https://firebasestorage.googleapis.com/v0/b/',

  version: '1.0.0-beta.1',

  sentryDsn: ''

};

// https://github.com/PatrickJS/angular-starter/blob/master/src/environments/environment.prod.ts
