// See: environment.ts

export interface DynamicFormsConfig {

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
