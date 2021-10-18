// import { enableProdMode } from '@angular/core';

import { Environment } from './models';

// enableProdMode();

export const environment: Environment = {

  production: true,

  serverScheme: 'http',
  serverHost: '127.0.0.1',
  serverPort: '30001',

  defaultLanguage: 'en-gb', // 'en-gb', 'de-ch'

  isDebugMode: false,

  version: '0.0.1-beta.3',

  sentryDsn: ''

};
