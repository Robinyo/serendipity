// See: src/environment.ts

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

  storageUriPrefix: string;

  version: string;

  sentryDsn: string;

}
