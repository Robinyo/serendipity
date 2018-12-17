import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { TaskListModel } from '../../models/task-list.model';

import { LoggerService } from 'utils';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('admin:test')
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  // private processEngineUriPrefix = 'http://localhost:8080/flowable-task/process-api/runtime/';
  private processEngineUriPrefix = '/flowable-task/process-api/runtime/';

  constructor(private httpClient: HttpClient,
              private logger: LoggerService) {

  }

  public getTasks(): Observable<TaskListModel>   {

    const endpoint = `${this.processEngineUriPrefix}tasks?sort=createTime&order=asc`;

    return this.httpClient.get<any>(endpoint, httpOptions).pipe(

      catchError(this.handleError('getTasks', []))
    );

    // return this.httpClient.get<TaskListModel>(this.contactsUrl);
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

// https://www.flowable.org/docs/userguide/index.html#restPagingAndSort

// curl -i 'http://admin:test@localhost:8080/flowable-task/process-api/runtime/tasks'

// https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/process-services/task-list/services/tasklist.service.ts

/*

// this.logger(`${operation} failed: ${error.message}`);

*/
