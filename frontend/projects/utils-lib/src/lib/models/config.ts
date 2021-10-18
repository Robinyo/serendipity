export interface Config {

  production: boolean;

  serverScheme: string;
  serverHost: string;
  serverPort: string;

  defaultLanguage: string;

  isDebugMode: boolean;

  version: string;

  sentryDsn: string;

}
