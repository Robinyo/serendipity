export const environment = {

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

// https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1
