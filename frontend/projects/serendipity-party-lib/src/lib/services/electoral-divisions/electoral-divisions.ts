import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';

import { CollectionService } from 'serendipity-utils-lib';

import { ELECTORIAL_DIVISIONS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ElectoralDivisionsService extends CollectionService {

  constructor() {

    super();

    this.url = this.getUrlPrefix() + ELECTORIAL_DIVISIONS;

  }

  public findByName(name: string): Observable<any> {

    this.logger.info('Electoral Divisions Service: findByName()');

    const url = this.url + 'search/findByName';
    const queryParams = '?name=' + name;

    this.logger.info('url: ' + url);
    this.logger.info('queryParams: ' + queryParams);

    return this.httpClient.get(url + queryParams, this.getHttpOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        this.logger.info('Electoral Divisions Service: findByName() completed');

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');
      })

    );

  }


}
