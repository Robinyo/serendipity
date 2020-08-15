import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends CollectionService {

  constructor() {

    super();

    this.url = this.getUrlPrefix() + '/repository/process-definitions';
  }

  public getProcesses(): Observable<any> {

    this.logger.info('ProcessesService: getProcesses()');

    // https://flowable.com/open-source/docs/bpmn/ch15-REST/#list-of-process-definitions
    const latest = 'true';

    const params = new HttpParams().set('latest', latest);

    this.logger.info('ProcessesService url: ' + this.url);
    this.logger.info('ProcessesService params: ' + params);

    return this.httpClient.get(this.url, this.getHttpOptions(params)).pipe(

      tap(() => {

        this.logger.info('ProcessesService: getProcesses() completed');

      }),
      catchError(error => {

        this.logger.info('ProcessesService: getProcesses() -> catchError()');

        if (error === undefined) {

          error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
          throw error;

        } else {

          return this.handleError('Get tasks', []);
          // return throwError(error);
        }

      })

    );

  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.logger.info('TasksService: handleError()');

      // TODO: send the error to your remote logging infrastructure e.g., Sentry

      // TODO: better job of transforming error for user consumption
      this.logger.error(operation + ' failed: ' + error.message);

      // Let the app keep running by returning an empty result (i.e., [])
      return of(result as T);
    };
  }

}
