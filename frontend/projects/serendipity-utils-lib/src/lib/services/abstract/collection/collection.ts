import { inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { HttpOptions } from '../../../models/http-options';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export abstract class CollectionService {

  protected httpClient = inject(HttpClient);
  protected logger: LoggerService = inject(LoggerService);

  protected httpOptions: HttpOptions | undefined;
  protected url = '';

  protected getUrlPrefix(): string {
    return environment.serverScheme + '://' + environment.serverHost;
  }

  protected getHttpOptions(params: any = undefined): HttpOptions {

    // this.logger.info('Collection Service: getHttpOptions()');

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
