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

  okta: {
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

  auth0: {
    domain: string,
    client_id: string;
    redirect_uri: string;
  };

  storageUriPrefix: string;

  version: string;

  sentryDsn: string;

}
