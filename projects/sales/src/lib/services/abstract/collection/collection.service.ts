import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injector, Type } from '@angular/core';

import { SalesConfig } from '../../../models/config';
import { HttpOptions } from '../../../models/http';

import { Observable, of, throwError } from 'rxjs';

import { EnvironmentService, LoggerService, StaticInjectorService } from 'utils';

export abstract class CollectionService {

  protected config: SalesConfig;
  protected httpOptions: HttpOptions;
  protected url: string;

  protected environmentService: EnvironmentService;
  protected httpClient: HttpClient;
  protected logger: LoggerService;

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.environmentService = injector.get<EnvironmentService>(EnvironmentService as Type<EnvironmentService>);
    this.httpClient = injector.get<HttpClient>(HttpClient as Type<HttpClient>);
    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);

    this.config = this.environmentService.getConfig();
  }

  protected getHttpOptions(params: HttpParams = null): HttpOptions {

    // his.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response',
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

  // https://angular.io/guide/http#getting-error-details

  /*

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.logger.info('ContactsService: handleError()');

      // TODO: send the error to your remote logging infrastructure e.g., Sentry

      // TODO: better job of transforming error for user consumption
      this.logger.error(operation + ' failed: ' + error.message);

      // Let the app keep running by returning an empty result (i.e., [])
      return of(result as T);
    };
  }

  */

  /*

  protected handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);

    } else {

      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');

  }

  */

}

// https://angular.io/guide/http#getting-error-details

// https://stackoverflow.com/questions/47761262/angular-4-5-httpclient-argument-of-type-string-is-not-assignable-to-body/47761516#47761516

/*

protected handleError(error: HttpErrorResponse) {

  if (error.error instanceof ErrorEvent) {

    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);

  } else {

    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }

  // return an observable with a user-facing error message
  return throwError('Something bad happened; please try again later.');

}

*/

/*

protected handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to your remote logging infrastructure e.g., Sentry
    this.logger.error(error);

    // TODO: better job of transforming error for user consumption
    // this.logger.info(operation + ' failed: ' + error.message);

    // Let the app keep running by returning an empty result
    return of(result as T);
  };
}

*/

/*

  protected getHttpOptions(params: HttpParams = null) {

    this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

*/

/*

  protected getHttpOptions(params: HttpParams) {

    this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      const user: User = this.authService.getUser();

      if (typeof user === 'undefined') {
        this.logger.error('CollectionService getHttpOptions() - user is undefined');
        return this.httpOptions;
      }

      const token = user.username + ':' + user.password;

      this.logger.info('CollectionService getHttpOptions() - token: ' + token);

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(token)
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

*/


