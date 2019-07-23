export interface Config {

  production: boolean;

  defaultLanguage: string;

  isDebugMode: boolean;

  firebase: {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string
  };

  oidc: {
    clientId: string,
    grantType: string,
    issuer: string,
    redirectUri: string,
    responseType: string,
    scope: string,
    testing: {
      disableHttpsCheck: boolean
    }
  };

  storageUriPrefix: string;

  version: string;

  sentryDsn: string;

}
