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

  public findOne(id: string): Observable<Account> {

    return this.httpClient.get(this.url + id).pipe(

      map((item: any) => this.adapter.adapt(item)),

      tap(() => {
        this.logger.info('AccountsService: findOne() completed');
      }),
      catchError(this.handleError)
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

}
