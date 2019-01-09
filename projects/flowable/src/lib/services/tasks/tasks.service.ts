import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TaskListModel } from '../../models/task-list.model';

import { AuthService, User } from 'auth';

import { LoggerService } from 'utils';

const completeTaskBody = {
  'action' : 'complete',
  'variables' : []
};

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // private processEngineUriPrefix = 'http://localhost:8080/flowable-task/process-api/runtime/';
  private processEngineUriPrefix = '/flowable-task/process-api/';

  private httpOptions = null;

  constructor(private authService: AuthService,
              private httpClient: HttpClient,
              private logger: LoggerService) {

  }

  // public getTasks(): Observable<TaskListModel>   {
  public getTasks(): Observable<any> {

    this.logger.info('TasksService: getTasks()');

    const endpoint = `${this.processEngineUriPrefix}runtime/tasks`;

    // https://www.flowable.org/docs/userguide/index.html#_request_parameters
    const sort = 'createTime';
    const order = 'desc';
    // const start = 0;
    // const size = 16;

    const params = new HttpParams().set('sort', sort).set('order', order);

    return this.httpClient.get<TaskListModel>(endpoint, this.getHttpOptions(params))
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

    return this.httpClient.post<any>(endpoint, completeTaskBody, this.getHttpOptions(null))
      .pipe(
        tap(() => {
          this.logger.info('TasksService: completeTask() completed');
        }),
        catchError(this.handleError('completeTask', []))
      );

  }

  private getHttpOptions(params: HttpParams) {

    this.logger.info('TasksService: getHttpOptions()');

    if (!this.httpOptions) {

      const user: User = this.authService.getUser();
      const token = user.username + ':' + user.password;

      this.logger.info('TasksService getHttpOptions() - token: ' + token);

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

// https://github.com/camunda-consulting/code/blob/master/snippets/camunda-tasklist-examples/camunda-angular-app/src/app/

// https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/process-services/task-list/services/tasklist.service.ts

// const endpoint = `${this.processEngineUriPrefix}runtime/tasks?sort=createTime&order=asc`;

// https://www.flowable.org/docs/userguide/index.html#restUsageInTomcat
// 'Accept': 'application/json',

/*
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('admin:test')
  }),
  params: null
};
*/

/*

  // return this.httpClient.get<TaskListModel>(endpoint, this.getHttpOptions(params));

Type 'Observable<HttpEvent<TaskListModel>>' is not assignable to type 'Observable<TaskListModel>'.
   Type 'HttpEvent<TaskListModel>' is not assignable to type 'TaskListModel'.
      Type 'HttpSentEvent' is not assignable to type 'TaskListModel'.
         Property 'total' is missing in type 'HttpSentEvent'.


  return this.httpClient.get<any>(endpoint, this.getHttpOptions(params))
    .pipe(
      tap(() => {
        this.logger.info('TasksService: getTasks() completed');
      }),
      catchError(this.handleError('getTasks', []))
    );

*/

/*

  public ping() {

    this.logger.info('TasksService: ping()');

    const subscription: Subscription = this.getTasks().subscribe(() => {

      this.logger.info('TasksService: ping() completed');
      subscription.unsubscribe();
    });

  }


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

