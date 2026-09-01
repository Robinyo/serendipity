import { Injectable} from '@angular/core';

import { AbstractCollectionService } from 'serendipity-utils-lib';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class CollectionService extends AbstractCollectionService {

  protected override getDefaultHttpGetOptions(params: any = undefined): any {

    // Manually instantiate distinct, override-safe headers
    const xmlHeaders = new HttpHeaders({
      'Accept': 'text/xml, text/plain'
    });

    // Set responseType cleanly to 'text' as a primitive literal type string config
    let options = {
      headers: xmlHeaders,
      responseType: 'text' as const,
      params: undefined
    };

    if (params) {

      options.params = params;

      this.logger.info('params: ' + JSON.stringify(params, null, 2));

    }

    // this.logger.info('httpOptions: ' + JSON.stringify(options, null, 2));

    return options;
  }

  protected override getDefaultHttpDeleteOptions(params: any = undefined): any {
    return this.getDefaultHttpGetOptions(params);
  }

  protected override getDefaultHttpPostOptions(params: any = undefined): any {

    // Manually instantiate distinct, override-safe headers
    const xmlHeaders = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Accept': 'text/xml, text/plain'
    });

    // Set responseType cleanly to 'text' as a primitive literal type string config
    let options = {
      headers: xmlHeaders,
      responseType: 'text' as const,
      params: undefined
    };

    if (params) {

      options.params = params;

      this.logger.info('params: ' + JSON.stringify(params, null, 2));

    }

    // this.logger.info('httpOptions: ' + JSON.stringify(options, null, 2));

    return options;

  }

  protected override getDefaultHttpPutOptions(params: any = undefined): any {
    return this.getDefaultHttpPostOptions(params);
  }

}



/*

import { Injectable} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { AbstractCollectionService, HttpOptions } from 'serendipity-utils-lib';

@Injectable()
export class CollectionService extends AbstractCollectionService {

  protected override getDefaultHttpGetOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.logger.info('Collection Service: getDefaultHttpGetOptions()');

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

      this.logger.info('Collection Service: getDefaultHttpPostOptions()');

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

}

*/
