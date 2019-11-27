import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

import { Account } from '../../models/account';
import { AccountAdapter } from '../../adapters/account.adapter';

import { LoggerService } from 'utils';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class AccountsService extends CollectionService {

  constructor(private httpClient: HttpClient,
              private adapter: AccountAdapter,
              protected logger: LoggerService) {

    super(logger);

    this.url = 'http://localhost:3001/api/organisations/';
  }

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


  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.logger.info('AccountsService: handleError()');

      // TODO: send the error to your remote logging infrastructure e.g., Sentry

      // TODO: better job of transforming error for user consumption
      this.logger.error(operation + ' failed: ' + error.message);

      // Let the app keep running by returning an empty result (i.e., [])
      return of(result as T);
    };
  }

  public findOne(id: string): Observable<Account> {

    return this.httpClient.get(this.url + id).pipe(

      map((item: any) => this.adapter.adapt(item)),

      tap(() => {
        this.logger.info('AccountsService: findOne() completed');
      }),
      catchError(this.handleError)
    );

  }

  public create(account: Account): Observable<HttpResponse<Account>> {

    return this.httpClient.post<HttpResponse<Account>>(this.url, account, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('AccountsService: create() completed');
      }),
      catchError(this.handleError)
    );

  }

  public update(id: string, account: Account): Observable<HttpResponse<Account>> {

    return this.httpClient.patch<HttpResponse<Account>>(this.url + id, account, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('AccountsService: update() completed');
      }),
      catchError(this.handleError)
    );

  }

  public delete(id: string): Observable<Account> {

    return this.httpClient.delete<Account>(this.url + id).pipe(
      tap(() => {
        this.logger.info('AccountsService: delete() completed');
      }),
      catchError(this.handleError)
    );
  }

}
