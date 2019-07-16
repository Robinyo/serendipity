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
    issuer: string,
    redirectUri: string,
    scope: string,
    responseType: string,
    testing: {
      disableHttpsCheck: boolean
    }
  };

  storageUriPrefix: string;

  version: string;

  sentryDsn: string;

}
