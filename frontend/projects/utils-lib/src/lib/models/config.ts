export interface Config {

  production: boolean;

  serverScheme: string;
  serverHost: string;
  serverPort: string;

  partyServicePort: string;
  workServicePort: string;

  defaultLanguage: string;

  isDebugMode: boolean;

  version: string;

  sentryDsn: string;

}
