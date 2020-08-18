import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

import { Account } from '../../models/account';
import { AccountAdapter } from '../../adapters/account.adapter';

@Injectable({
  providedIn: 'root'
})
export class AccountsService extends CollectionService {

  constructor(private adapter: AccountAdapter) {

    super();

    this.url = this.getUrlPrefix() + '/api/organisations/';
  }

  public find(offset: number = 0, limit: number = 100, filter: string = ''): Observable<any> {

    this.logger.info('AccountsService: find()');

    let queryParams;

    if (filter.length) {

      this.url = this.getUrlPrefix() + '/api/organisations/search/findByNameStartsWith';
      queryParams = '?name=' + filter + '&page=' + offset + '&size=' + limit + '&sort=name&name.dir=asc';

    } else {

      this.url = 'http://localhost:' + this.config.serverPort + '/api/organisations/';
      queryParams = '?page=' + offset + '&size=' + limit + '&sort=name&name.dir=asc';
    }

    this.logger.info('AccountsService url: ' + this.url);
    this.logger.info('AccountsService queryParams: ' + queryParams);

    return this.httpClient.get(this.url + queryParams, this.getHttpOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        this.logger.info('AccountsService: find() completed');

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');
      })

    );

  }

  public findOne(id: string): Observable<Account> {

    return this.httpClient.get(this.url + id).pipe(

      map((item: any) => this.adapter.adapt(item)),

      tap(() => {
        this.logger.info('AccountsService: findOne() completed');
      })
    );

  }

  public create(account: Account): Observable<HttpResponse<Account>> {

    return this.httpClient.post<HttpResponse<Account>>(this.url, account, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('AccountsService: create() completed');
      })
    );

  }

  public update(id: string, account: Account): Observable<HttpResponse<Account>> {

    return this.httpClient.patch<HttpResponse<Account>>(this.url + id, account, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('AccountsService: update() completed');
      })
    );

  }

  public delete(id: string): Observable<Account> {

    return this.httpClient.delete<Account>(this.url + id).pipe(
      tap(() => {
        this.logger.info('AccountsService: delete() completed');
      })
    );

  }

}

/*


  // path, operator, value
  // e.g., name, =, B%
  // [name]=B%

  public find(offset: number = 0, limit: number = 100, value: string = ''): Observable<any> {

    this.logger.info('AccountsService: find()');

    let filterParam = '';

    if (value.length) {
      filterParam = '&filter[name]=' + value + '%';
    }

    const queryParams = '?offset=' + offset + '&limit=' + limit + filterParam;

    this.logger.info('AccountsService queryParams: ' + queryParams);

    return this.httpClient.get(this.url + queryParams, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('AccountsService: find() completed');
      }),
      catchError(error => {

        this.logger.info('AccountsService: find() -> catchError()');

        if (error === undefined) {

          error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
          throw error;

        } else {

          return this.handleError('Find', []);
          // return throwError(error);
        }

      })

    );

  }


*/
