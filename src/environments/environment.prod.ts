import { enableProdMode } from '@angular/core';

import { Environment } from './models';

enableProdMode();

export const environment: Environment = {

  production: true,

  serverScheme: 'http',
  serverHost: 'localhost',
  serverPort: '3001',

  defaultLanguage: 'en-gb', // 'en-gb', 'de-ch'

  isDebugMode: false,

  okta: {
    clientId: '',
    grantType: 'authorization_code',
    issuer: '',
    redirectUri: 'http://localhost:4200/authorization-code/callback',
    responseType: 'code',
    scope: ['openid', 'profile', 'email', 'phone', 'address', 'groups'],
    testing: {
      disableHttpsCheck: false
    }
  },

  auth0: {
    client_id: '',
    domain: '',
    redirect_uri: 'http://localhost:4200/authorization-code/callback',
    scope: 'openid profile email phone address'
  },

  oidc: {
    clientId: 'serendipity-pwa',
    filterProtocolClaims: true,
    // grantType: 'authorization_code',
    issuer: 'http://localhost:10001/auth/realms/development',
    loadUserInfo: true,
    postLogoutRedirectUri: 'http://localhost:4200/',
    redirectUri: 'http://localhost:4200/authorization-code/callback',
    responseType: 'code',
    scope: 'openid profile email phone address offline_access individual:get'
  },

  version: '1.0.0-beta.1',

  sentryDsn: ''

};
