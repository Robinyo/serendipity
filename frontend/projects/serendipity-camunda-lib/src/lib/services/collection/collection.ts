import { Injectable} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { AbstractCollectionService, HttpOptions } from 'serendipity-utils-lib';

import { USER_TASKS } from './constants';

@Injectable()
export class CollectionService extends AbstractCollectionService {

  protected override getUrlPrefix(): string {
    return super.getUrlPrefix() + USER_TASKS;
  }

  protected override getDefaultHttpGetOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.logger.info('Abstract Collection Service: getDefaultHttpGetOptions()');

      // https://www.flowable.com/open-source/docs/bpmn/ch14-REST#usage-in-tomcat

      const baseHeaders = new HttpHeaders().set('Accept', 'application/json');

      // this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        observe: 'body' as const,
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

    if (!this.httpOptions) {

      this.logger.info('Abstract Collection Service: getDefaultHttpPostOptions()');

      // https://www.flowable.com/open-source/docs/bpmn/ch14-REST#usage-in-tomcat

      const baseHeaders = new HttpHeaders().set('Content-Type', 'application/json');

      // this.logger.info('baseHeaders: ' + JSON.stringify(baseHeaders, null, 2));

      this.httpOptions = {
        headers: baseHeaders,
        observe: 'body' as const,
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



  /*

  protected override getDefaultHttpGetOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.logger.info('Abstract Collection Service: getDefaultHttpGetOptions()');

      const baseHeaders = new HttpHeaders().set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

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

  protected override getDefaultHttpPostOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.logger.info('Abstract Collection Service: getDefaultHttpPostOptions()');

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

  */

}
