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
