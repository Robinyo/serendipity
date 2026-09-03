import { inject } from '@angular/core';

import { LoggerService } from 'serendipity-utils-lib';

export class PartyAdapter {

  protected logger = inject(LoggerService);

}

/*

import { inject } from '@angular/core';

import { APP_ENVIRONMENT, LoggerService } from 'serendipity-utils-lib';

export class PartyAdapter {

  protected logger = inject(LoggerService);

  private env!: any;

  protected constructor() {
    this.env = inject(APP_ENVIRONMENT);
  }

  protected getUrlPrefix(): string {
    return `${this.env.serverScheme}://${this.env.serverHost}`;
  }

}

*/
