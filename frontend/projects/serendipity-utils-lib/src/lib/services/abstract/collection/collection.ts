import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HttpOptions } from '../../../models/http-options';
import { LoggerService } from '../../logger/logger.service';

import { environment } from '../../../environments/environment';

export abstract class CollectionService {

  protected httpClient = inject(HttpClient);
  protected logger: LoggerService = inject(LoggerService);

  protected httpOptions: HttpOptions | undefined;
  protected url = '';

  protected getUrlPrefix(): string {
    return environment.serverScheme + '://' + environment.serverHost;
  }

  protected getHttpOptions(params: any = undefined): HttpOptions {

    // his.logger.info('Collection Service: getHttpOptions()');

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response',
        params: undefined
      };

    }

    if (params) {
      this.httpOptions.params = params;
    }

    // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

}

// https://angular.dev/guide/http/setup
