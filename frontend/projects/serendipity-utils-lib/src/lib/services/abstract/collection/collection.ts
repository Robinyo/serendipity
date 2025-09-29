import { inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { HttpOptions } from '../../../models/http-options';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export abstract class AbstractCollectionService {

  protected httpClient = inject(HttpClient);
  protected logger: LoggerService = inject(LoggerService);

  protected httpOptions: HttpOptions | undefined;
  protected url = '';

  protected getUrlPrefix(): string {
    return environment.serverScheme + '://' + environment.serverHost;
  }

  // In Angular, when using the HttpClient to make HTTP requests, the observe option allows you to specify how much of
  // the HTTP response you want to receive. By default, HttpClient methods return an Observable that emits only the
  // response body. To receive the complete HttpResponse object, including headers, status code, and the body, you must
  // set the observe option to 'response'.

  protected getDefaultHttpGetOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.logger.info('Abstract Collection Service: getDefaultHttpGetOptions()');

      // https://www.flowable.com/open-source/docs/bpmn/ch14-REST#usage-in-tomcat

      const baseHeaders = new HttpHeaders().set('Accept', 'application/json');

      // this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        observe: 'response' as const,
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

      // https://www.flowable.com/open-source/docs/bpmn/ch14-REST#usage-in-tomcat

      const baseHeaders = new HttpHeaders().set('Content-Type', 'application/json');

      // this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        observe: 'response' as const,
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
}

// https://angular.dev/guide/http/making-requests
