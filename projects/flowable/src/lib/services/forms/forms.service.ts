import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService, User } from 'auth';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  private processEngineUriPrefix = '/flowable-task/process-api/';

  private httpOptions = null;

  constructor(private authService: AuthService,
              private httpClient: HttpClient,
              private logger: LoggerService) {

  }

  public submitFormData(body: any): Observable<any> {

    this.logger.info('FormsService: submitFormData()');

    const endpoint = `${this.processEngineUriPrefix}form/form-data`;

    this.httpOptions.params = null;

    this.logger.info('FormsService submitFormData() - endpoint: ' + endpoint);

    return this.httpClient.post<any>(endpoint, body, this.getHttpOptions(null))
    .pipe(
      tap(() => {
        this.logger.info('FormsService: submitFormData() completed');
      }),
      catchError(this.handleError('submitFormData', []))
    );

  }

  private getHttpOptions(params: HttpParams) {

    this.logger.info('FormsService: getHttpOptions()');

    if (!this.httpOptions) {

      const user: User = this.authService.getUser();
      const token = user.username + ':' + user.password;

      this.logger.info('FormsService getHttpOptions() - token: ' + token);

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Basic ' + btoa(token)
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to your remote logging infrastructure e.g., Sentry
      this.logger.error(error);

      // TODO: better job of transforming error for user consumption
      // this.logger.info(operation + ' failed: ' + error.message);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

}
