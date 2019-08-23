import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { HttpOptions } from '../../../models/http';

import { Observable, of, throwError } from 'rxjs';

import { LoggerService } from 'utils';

export abstract class CollectionService {

  // protected contactsUrl = 'api/contacts/';
  protected readonly contactsUrl = 'http://localhost:3001/api/individuals/';

  protected httpOptions: HttpOptions;

  constructor(protected logger: LoggerService) {}

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

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

  // https://angular.io/guide/http#getting-error-details

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

}

// https://angular.io/guide/http#getting-error-details

// https://stackoverflow.com/questions/47761262/angular-4-5-httpclient-argument-of-type-string-is-not-assignable-to-body/47761516#47761516

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


