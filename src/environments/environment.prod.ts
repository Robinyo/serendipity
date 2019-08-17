import { enableProdMode } from '@angular/core';

import { Environment } from './models';

enableProdMode();

export const environment: Environment = {

  production: true,

  defaultLanguage: 'en-GB',

  isDebugMode: false,

  firebase: {
    apiKey: 'AIzaSyASxWQ8whc3CrA6EXYII07d_xa3q27RVDc',
    authDomain: 'serendipity-f7626.firebaseapp.com',
    databaseURL: 'https://serendipity-f7626.firebaseio.com',
    projectId: 'serendipity-f7626',
    storageBucket: 'serendipity-f7626.appspot.com',
    messagingSenderId: '582668248299'
  },

  okta: {
    clientId: '0oatga8ebA4IkGg5U356',
    grantType: 'authorization_code',
    issuer: 'https://dev-335467.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/authorization-code/callback',
    responseType: 'code',
    scope: ['openid', 'profile', 'email', 'phone', 'address', 'groups'],
    testing: {
      disableHttpsCheck: true
    }
  },

  auth0: {
    client_id: 'vnq8n7pd6oyeqU07WSV93DEKxd8vRhcT',
    domain: 'dev-1uv3ymem.au.auth0.com',
    redirect_uri: 'http://localhost:4200/authorization-code/callback',
    scope: 'openid profile email phone address'
  },

  storageUriPrefix: 'https://firebasestorage.googleapis.com/v0/b/',

  version: '1.0.0-beta.1',

  sentryDsn: ''

};

// https://github.com/PatrickJS/angular-starter/blob/master/src/environments/environment.prod.ts
