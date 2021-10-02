// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './models';

export const environment: Environment = {

  production: false,

  serverScheme: 'http',
  serverHost: 'localhost',
  serverPort: '3001',

  defaultLanguage: 'en-gb', // 'en-gb', 'de-ch'

  isDebugMode: true,

  oidc: {
    clientId: 'serendipity-pwa',
    filterProtocolClaims: true,
    // grantType: 'authorization_code',
    issuer: 'http://localhost:10001/auth/realms/development',
    loadUserInfo: true,
    postLogoutRedirectUri: 'http://localhost:4200/',
    redirectUri: 'http://localhost:4200/authorization-code/callback',
    responseType: 'code',
    // scope: 'openid profile email phone address offline_access https://www.googleapis.com/auth/userinfo.email.individual'
    scope: 'openid profile email phone address offline_access individual:post individual:get individual:patch individual:delete'
  },

  version: '1.0.0-beta.1',

  sentryDsn: ''

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
