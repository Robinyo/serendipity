import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LoggerService } from 'utils';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('admin:test')
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  private processEngineUriPrefix = '/flowable-task/process-api/';

  constructor(private httpClient: HttpClient,
              private logger: LoggerService) {

  }

  public submitFormData(body: any): Observable<any> {

    this.logger.info('FormsService: submitFormData()');

    const endpoint = `${this.processEngineUriPrefix}form/form-data`;

    httpOptions.params = null;

    this.logger.info('FormsService submitFormData() - endpoint: ' + endpoint);

    return this.httpClient.post<any>(endpoint, body, httpOptions)
    .pipe(
      tap(() => {
        this.logger.info('FormsService: submitFormData() completed');
      }),
      catchError(this.handleError('submitFormData', []))
    );

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
