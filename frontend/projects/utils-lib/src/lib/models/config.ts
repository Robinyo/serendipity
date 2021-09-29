export interface Config {

  production: boolean;

  serverScheme: string;
  serverHost: string;
  serverPort: string;

  defaultLanguage: string;

  isDebugMode: boolean;

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
