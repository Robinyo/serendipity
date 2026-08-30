import { inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { APP_ENVIRONMENT } from '../../../models/environment.token';

import { HttpOptions } from '../../../models/http-options';
import { LoggerService } from '../../logger/logger.service';

// Abstract parents MUST have a decorator to preserve DI metadata shapes

@Injectable()
export abstract class AbstractCollectionService {

  // Declare properties without inline injection to stabilise cross-lib evaluation
  protected httpClient!: HttpClient;
  protected logger!: LoggerService;

  protected httpOptions: HttpOptions | undefined;
  protected url = '';

  private env!: any;

  protected constructor() {

    this.httpClient = inject(HttpClient);
    this.logger = inject(LoggerService);

    this.env = inject(APP_ENVIRONMENT);

  }

  // TODO

  protected getUrlPrefix(): string {
    return `${this.env.serverScheme}://${this.env.serverHost}`;
  }

  protected getDefaultHttpGetOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.logger.info('Abstract Collection Service: getDefaultHttpGetOptions()');

      const baseHeaders = new HttpHeaders().set('Accept', 'application/json');

      // this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        params: undefined
      };

    }

    if (params) {

      this.httpOptions.params = params;

      this.logger.info('params: ' + JSON.stringify(params, null, 2));

    }

    // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

  protected getDefaultHttpPostOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.logger.info('Abstract Collection Service: getDefaultHttpPostOptions()');

      const baseHeaders = new HttpHeaders().set('Content-Type', 'application/json');

      // this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        params: undefined
      };

    }

    if (params) {

      this.httpOptions.params = params;

      this.logger.info('params: ' + JSON.stringify(params, null, 2));

    }

    // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

  protected getDefaultHttpPutOptions(params: any = undefined): HttpOptions {
    return this.getDefaultHttpPostOptions(params);
  }

  protected getDefaultHttpDeleteOptions(params: any = undefined): HttpOptions {
    return this.getDefaultHttpPostOptions(params);
  }

}

// https://angular.dev/guide/http/making-requests
