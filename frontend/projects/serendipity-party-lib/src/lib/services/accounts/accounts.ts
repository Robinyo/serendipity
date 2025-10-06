import { inject, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractCollectionService } from 'serendipity-utils-lib';

import { AccountModel } from '../../models/account';
import { AccountAdapter } from '../../adapters/account';

import { ORGANISATIONS, ORGANISATIONS_WITHOUT_A_TRAILING_SLASH } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AccountsService extends AbstractCollectionService {

  private adapter: AccountAdapter = inject(AccountAdapter);

  constructor() {

    super();

    this.url = this.getUrlPrefix() + ORGANISATIONS;

    // this.logger.info('Accounts Service: constructor()');

  }

  // public find(offset: number = 0, limit: number = 100, filter: string = ''): Observable<any> {
  public find(filter: string, offset: number = 0, limit: number = 100): Observable<any> {

    this.logger.info('Accounts Service: find()');

    let url = this.getUrlPrefix() + ORGANISATIONS_WITHOUT_A_TRAILING_SLASH;
    let queryParams;

    if (filter.length) {

      url = url + '/search/findByNameStartsWith';
      queryParams = '?name=' + filter + '&page=' + offset + '&size=' + limit + '&sort=name&name.dir=asc';

    } else {

      queryParams = '?page=' + offset + '&size=' + limit + '&sort=name&name.dir=asc';
    }

    this.logger.info('url: ' + url);
    this.logger.info('queryParams: ' + queryParams);

    return this.httpClient.get(url + queryParams, this.getDefaultHttpGetOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        this.logger.info('AccountsService: find() completed');

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');

      })

    );

  }

  public findById(id: string): Observable<AccountModel> {

    this.logger.info('Accounts Service: findById()');

    this.logger.info('url: ' + this.url + id);

    return this.httpClient.get(this.url + id, this.getDefaultHttpGetOptions()).pipe(

      map((response: any) => this.adapter.adapt(response)),

      tap(() => {
        this.logger.info('Accounts Service: findById() completed');
      })
    );

  }

  public create(account: AccountModel): Observable<HttpResponse<AccountModel>> {

    return this.httpClient.post<HttpResponse<AccountModel>>(this.url, account, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Accounts Service: create() completed');
      })
    );

  }

  public update(id: string, account: AccountModel): Observable<HttpResponse<AccountModel>> {

    return this.httpClient.patch<HttpResponse<AccountModel>>(this.url + id, account, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Accounts Service: update() completed');
      })
    );

  }

  public delete(id: string): Observable<AccountModel> {

    return this.httpClient.delete<AccountModel>(this.url + id, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Accounts Service: delete() completed');
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
