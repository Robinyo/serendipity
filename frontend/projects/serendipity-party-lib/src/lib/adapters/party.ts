import { inject } from '@angular/core';

import { environment, LoggerService } from 'serendipity-utils-lib';

export class PartyAdapter {

  protected logger = inject(LoggerService);

  protected getUrlPrefix(): string {
    return environment.serverScheme + '://' + environment.serverHost + '/';
  }

}
