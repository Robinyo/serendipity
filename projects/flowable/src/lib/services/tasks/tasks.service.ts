import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TaskListModel } from '../../models/task-list.model';

import { LoggerService } from 'utils';

// https://www.flowable.org/docs/userguide/index.html#restUsageInTomcat
// 'Accept':  'application/json',

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('admin:test')
  })
};

/* tslint:disable */

const completeTaskBody = {
  "action" : "complete",
  "variables" : []
};

/* tslint:enable */

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // private processEngineUriPrefix = 'http://localhost:8080/flowable-task/process-api/runtime/';
  private processEngineUriPrefix = '/flowable-task/process-api/';

  constructor(private httpClient: HttpClient,
              private logger: LoggerService) {

  }

  public getTasks(): Observable<TaskListModel>   {

    this.logger.info('TasksService: getTasks()');

    const endpoint = `${this.processEngineUriPrefix}runtime/tasks?sort=createTime&order=desc`;

    this.logger.info('TasksService getTasks() - endpoint: ' + endpoint);

    return this.httpClient.get<any>(endpoint, httpOptions)
      .pipe(
        tap(() => {
          this.logger.info('TasksService: getTasks() completed');
        }),
        catchError(this.handleError('getTasks', []))
      );

  }

  public completeTask(taskId: string): Observable<any> {

    this.logger.info('TasksService: completeTask()');

    const endpoint = `${this.processEngineUriPrefix}runtime/tasks/${taskId}`;

    this.logger.info('TasksService completeTask() - endpoint: ' + endpoint);

    return this.httpClient.post<any>(endpoint, completeTaskBody, httpOptions)
      .pipe(
        tap(() => {
          this.logger.info('TasksService: completeTask() completed');
        }),
        catchError(this.handleError('completeTask', []))
      );

  }

  public ping() {

    this.logger.info('TasksService: ping()');

    const subscription: Subscription = this.getTasks().subscribe(() => {

      this.logger.info('TasksService: ping() completed');
      subscription.unsubscribe();
    });

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

// https://github.com/camunda-consulting/code/blob/master/snippets/camunda-tasklist-examples/camunda-angular-app/src/app/

// https://www.flowable.org/docs/userguide/index.html#restPagingAndSort

// curl -i 'http://admin:test@localhost:8080/flowable-task/process-api/runtime/tasks'

// https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/process-services/task-list/services/tasklist.service.ts

/*

  public ping() {

    this.logger.info('TasksService: ping()');

    const endpoint = `${this.processEngineUriPrefix}runtime/tasks?sort=createTime&order=desc`;

    this.logger.info('TasksService ping() - endpoint: ' + endpoint);

    this.httpClient.get<any>(endpoint, httpOptions)
    .pipe(
      tap(() => {

        this.logger.info('TasksService: ping() completed');

      }),
      catchError(this.handleError('ping', []))
    );

  }

  public ping() {

    this.logger.info('TasksService: ping()');

    // const endpoint = 'http://localhost:8080/flowable-task/process-api/runtime/tasks?sort=createTime&order=desc';
    const endpoint = 'http://localhost:8080/ping';

    this.logger.info('TasksService ping() - endpoint: ' + endpoint);

    return this.httpClient.get<any>(endpoint, httpOptions)
    .pipe(
      tap(() => {

        this.logger.info('TasksService: ping completed');

      }),
      catchError(this.handleError('getTasks', []))
    );

  }


  public completeTask(taskId: string, data: any) {

    const endpoint = `${this.processEngineUriPrefix}runtime/tasks/${taskId}`;

    return this.httpClient.post(endpoint, data, httpOptions).pipe(

      catchError(this.handleError('completeTask', []))
    );
  }

*/

/*

// this.logger(`${operation} failed: ${error.message}`);

*/

