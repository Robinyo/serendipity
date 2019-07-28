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
    scope: string[],
    testing: {
      disableHttpsCheck: boolean
    }
  };

  auth0: {
    client_id: string;
    domain: string,
    redirect_uri: string;
    scope: string,
  };

  storageUriPrefix: string;

  version: string;

  sentryDsn: string;

}

/*

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

*/
