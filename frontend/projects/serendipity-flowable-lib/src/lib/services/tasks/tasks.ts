import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CollectionService } from 'serendipity-utils-lib';

import { TaskListModel } from '../../models/task-list';
import { TaskActionRequest } from '../../models/task-action';

import { TASKS, TASKS_WITHOUT_A_TRAILING_SLASH } from './constants';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class TasksService extends CollectionService {

  constructor() {

    super();

    this.url = this.getUrlPrefix() + TASKS;
  }

  // https://flowable.com/open-source/docs/bpmn/ch15-REST/#task-actions

  public async actionTask(id: string, request: any): Promise<any> {

    this.logger.info('Tasks Service: actionTask()');

    // this.url = this.getUrlPrefix() + '/process-api/runtime/tasks/' + id;
    const url = this.url +  + id;

    this.logger.info('url: ' + url);

    return this.httpClient.post<any>(url, request, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('Tasks Service: actionTask() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  public async completeSimpleTask(id: string, request: TaskActionRequest): Promise<any> {

    this.logger.info('TasksService: completeSimpleTask()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/tasks/' + id;

    this.logger.info('url: ' + this.url);

    return this.httpClient.post<any>(this.url, request, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('TasksService: completeSimpleTask() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  public async completeTask(id: string, request: TaskActionRequest): Promise<any> {

    this.logger.info('TasksService: completeTask()');

    const form = await this.getForm(id);

    request.formDefinitionId = form.id;

    this.logger.info('TasksService taskId: ' + id + ' formDefinitionId: ' + request.formDefinitionId);

    this.url = this.getUrlPrefix() + '/process-api/runtime/tasks/' + id;

    this.logger.info('url: ' + this.url);

    return this.httpClient.post<any>(this.url, request, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('TasksService: completeTask() completed');

      })).toPromise().catch(error => {

      this.logger.info('TasksService: completeTask() error');

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  public find(params: HttpParams): Observable<any> {

    this.logger.info('Tasks Service: find()');

    // this.url = this.getUrlPrefix() + '/process-api/runtime/tasks';
    const url = this.getUrlPrefix() + TASKS_WITHOUT_A_TRAILING_SLASH;

    this.logger.info('url: ' + url);
    this.logger.info('params: ' +  JSON.stringify(params, null, 2));

    return this.httpClient.get<TaskListModel>(url, this.getHttpOptions(params)).pipe(
      tap(() => {
        this.logger.info('Tasks Service: find() completed');
      })
    );

  }

  public getForm(taskId: string): Promise<any> {

    this.logger.info('TasksService: getForm()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/tasks/' + taskId + '/form';

    this.logger.info('url: ' + this.url);

    return this.httpClient.get<any>(this.url, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('TasksService: getForm() completed');

      })).toPromise().catch(error => {

      this.logger.info('TasksService: getForm() error');

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  public getRoles(taskId: string): Observable<any> {

    this.logger.info('TasksService: getRoles()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/tasks/' + taskId + '/identitylinks';

    this.logger.info('url: ' + this.url);

    return this.httpClient.get<TaskListModel>(this.url, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('TasksService: getRoles() completed');
      })
    );

  }

  public startTask(request: any): Promise<any> {

    this.logger.info('TasksService: startTask()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/tasks';

    this.logger.info('url: ' + this.url);

    return this.httpClient.post(this.url, request, this.getHttpOptions()).pipe(

      tap((response: any) => {
        // tap(() => {

        this.logger.info('Task Instance: ' + JSON.stringify(response, null, 2) + '\n');

        this.logger.info('TasksService: startTask() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  // https://flowable.com/open-source/docs/bpmn/ch15-REST/#update-a-task

  public async updateSimpleTask(id: string, request: any): Promise<any> {

    this.logger.info('TasksService: updateSimpleTask()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/tasks/' + id;

    this.logger.info('url: ' + this.url);

    return this.httpClient.put<any>(this.url, request, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('TasksService: updateSimpleTask() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

}

/*

  public find(): Observable<any> {

    this.logger.info('TasksService: getTasks()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/tasks';

    this.logger.info('url: ' + this.url);

    // https://www.flowable.org/docs/userguide/index.html#_request_parameters
    // https://flowable.com/open-source/docs/bpmn/ch15-REST/#list-of-tasks
    const excludeSubTasks = 'true';
    const sort = 'createTime';
    const order = 'desc'; // 'asc | desc'
    // const start = 0;
    // const size = 16;

    const params = new HttpParams().set('excludeSubTasks', excludeSubTasks).set('sort', sort).set('order', order);

    this.logger.info('params: ' + params);

    return this.httpClient.get<TaskListModel>(this.url, this.getHttpOptions(params)).pipe(
      tap(() => {
        this.logger.info('TasksService: getTasks() completed');
      })
    );

  }

*/

/*

  public getTasks(): Observable<any> {

    this.logger.info('TasksService: getTasks()');

    // https://www.flowable.org/docs/userguide/index.html#_request_parameters
    const sort = 'createTime';
    const order = 'asc'; // 'desc'
    // const start = 0;
    // const size = 16;

    const params = new HttpParams().set('sort', sort).set('order', order);

    this.logger.info('url: ' + this.url);
    this.logger.info('params: ' + params);

    return this.httpClient.get<TaskListModel>(this.url, this.getHttpOptions(params)).pipe(

      tap(() => {

        this.logger.info('TasksService: getTasks() completed');

      }),
      catchError(error => {

        this.logger.info('TasksService: getTasks() -> catchError()');

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

*/

/*

public getTasks(): Promise<any> {

  this.logger.info('TasksService: getTasks()');

  const endpoint = `${this.processEngineUriPrefix}runtime/tasks`;

  // https://www.flowable.org/docs/userguide/index.html#_request_parameters
  const sort = 'createTime';
  const order = 'desc';
  // const start = 0;
  // const size = 16;

  const params = new HttpParams().set('sort', sort).set('order', order);

  return this.httpClient.get(endpoint, this.getHttpOptions(params)).pipe(

    tap(() => {

      this.logger.info('TasksService: getTasks() completed');

    })).toPromise().catch(error => {

    if (error === undefined) {
      error = new Error('Connection refused');
    }

    throw error;

  });

}

*/

// https://blog.angular-university.io/rxjs-error-handling/

// https://medium.com/@krishna.acondy/a-generic-http-service-approach-for-angular-applications-a7bd8ff6a068

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

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// import { TaskListModel } from '../../models/task-list.model';

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

    return this.httpClient.get<TaskListModel>(endpoint, this.getHttpOptions(params)).pipe(
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

    return this.httpClient.post<any>(endpoint, completeTaskBody, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('TasksService: completeTask() completed');
      }),
      catchError(this.handleError('completeTask', []))
    );

  }

}

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
