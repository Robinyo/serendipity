import { Injectable} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { AbstractCollectionService, HttpOptions } from 'serendipity-utils-lib';

import { FLOWABLE_TASK } from './constants';

@Injectable()
export class CollectionService extends AbstractCollectionService {

  protected override getUrlPrefix(): string {
    return super.getUrlPrefix() + FLOWABLE_TASK;
  }

  // In Angular, when using the HttpClient to make HTTP requests, the observe option allows you to specify how much of
  // the HTTP response you want to receive. By default, HttpClient methods return an Observable that emits only the
  // response body. To receive the complete HttpResponse object, including headers, status code, and the body, you must
  // set the observe option to 'response'.

  protected override getDefaultHttpGetOptions(params: any = undefined): HttpOptions {

    this.logger.info('Collection Service: getDefaultHttpGetOptions()');

    if (!this.httpOptions) {

      // https://www.flowable.com/open-source/docs/bpmn/ch14-REST#usage-in-tomcat

      const baseHeaders = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', 'Basic ' + btoa('flowable:Password12'));

      this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        // observe: 'response' as const,
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

  protected override getDefaultHttpPostOptions(params: any = undefined): HttpOptions {

    this.logger.info('Collection Service: getDefaultHttpPostOptions()');

    if (!this.httpOptions) {

      // https://www.flowable.com/open-source/docs/bpmn/ch14-REST#usage-in-tomcat

      const baseHeaders = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Basic ' + btoa('flowable:Password12'));

      this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        // observe: 'response' as const,
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
