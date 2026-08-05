import { Injectable } from '@angular/core';
// import { HttpParams } from '@angular/common/http';

import { Observable, concatMap, expand, of, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CollectionService } from '../collection/collection';

import { ASSIGNMENT, COMPLETION, FORM, SEARCH, USER_TASKS } from './constants';

export interface TaskResponse {
  state:  string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService extends CollectionService {

  protected override getUrlPrefix(): string {
    return super.getUrlPrefix() + USER_TASKS;
  }

  public search(body: any): Observable<any> {

    this.logger.info('Tasks Service: search()');

    const url = this.getUrlPrefix() + '/' + SEARCH;

    this.logger.info('url: ' + url);
    this.logger.info('body: ' + JSON.stringify(body, null, 2));

    return this.httpClient.post(url, body, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Tasks Service: search() completed');
      })
    );

  }

  public form(userTaskKey: string): Observable<any> {

    this.logger.info('Tasks Service: form()');

    const url = this.getUrlPrefix() + '/' +  userTaskKey + '/' + FORM;

    this.logger.info('url: ' + url);

    return this.httpClient.get(url, this.getDefaultHttpGetOptions()).pipe(
      tap(() => {
        this.logger.info('Tasks Service: form() completed');
      })
    );

  }

  public assignment(userTaskKey: string, body: any): Observable<any> {

    this.logger.info('Tasks Service: assignment()');

    const url = this.getUrlPrefix() + '/' +  userTaskKey + '/' + ASSIGNMENT;

    this.logger.info('url: ' + url);
    this.logger.info('body: ' + JSON.stringify(body, null, 2));

    return this.httpClient.post(url, body, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Tasks Service: assignment() completed');
      })
    );

  }

  public completion(userTaskKey: string, variables: any): Observable<any> {

    this.logger.info('Tasks Service: assignment()');

    const url = this.getUrlPrefix() + '/' +  userTaskKey + '/' + COMPLETION;

    this.logger.info('url: ' + url);
    this.logger.info('variables: ' + JSON.stringify(variables, null, 2));

    return this.httpClient.post(url, { variables: variables }, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Tasks Service: completion() completed');
      })
    );

  }

  pollTask(userTaskKey: string): Observable<TaskResponse> {

    this.logger.info('Tasks Service: pollTask()');

    const INITIAL_DELAY_MS = 1000; // Start with a 1-second delay
    const MAX_DELAY_MS = 16000;    // Cap the maximum delay at 16 seconds
    let currentDelay = INITIAL_DELAY_MS;

    const url = this.getUrlPrefix() + '/' +  userTaskKey

    this.logger.info('url: ' + url);

    // Trigger the initial HTTP request immediately
    return this.httpClient.get<TaskResponse>(url).pipe(
      expand((res) => {
        // Stop recursion when state is COMPLETED (or CANCELED)
        if (res.state === 'COMPLETED' || res.state === 'CANCELED') {
          return of(); // Returning empty observable stops `expand`
        }

        // Calculate delay for the next poll attempt
        const delayForNextAttempt = currentDelay;
        currentDelay = Math.min(currentDelay * 2, MAX_DELAY_MS);

        // Wait for `delayForNextAttempt` before firing the next request
        return timer(delayForNextAttempt).pipe(
          concatMap(() => this.httpClient.get<TaskResponse>(url))
        );
      })
    );

  }

}
