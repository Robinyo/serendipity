export interface Config {

  production: boolean;

  serverScheme: string;
  serverHost: string;
  serverPort: string;

  defaultLanguage: string;

  isDebugMode: boolean;

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

  // https://github.com/IdentityModel/oidc-client-js

  oidc: {
    clientId: string,               // client_id

    filterProtocolClaims?: boolean, // filterProtocolClaims

    grantType?: string,
    issuer: string,                 // authority

    loadUserInfo?: boolean,         // loadUserInfo
    postLogoutRedirectUri?: string, // post_logout_redirect_uri

    redirectUri: string,            // redirect_uri
    responseType: string,           // response_type
    scope: string,                  // scope
  };

  version: string;

  sentryDsn: string;

}

/*

  firebase: {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string
  };

  storageUriPrefix: string;

*/
