import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  protected url: string;

  constructor(private httpClient: HttpClient,
              private logger: LoggerService) {

    this.url = 'http://localhost:3001/api/email/';
  }

  public sendEmail(options: any) {

    return this.httpClient.post(this.url, options).pipe(
      tap(() => {
        this.logger.info('EmailService: sendEmail() completed');
      }),
      catchError(this.handleError)
    );

  }

  /*

    public getFormMetadata(formId: string): Promise<DynamicFormControlModel[]> {
    return this.httpClient.get<DynamicFormControlModel[]>(this.uriPrefix + formId + this.uriSuffix).toPromise();
  }

  */

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

}
