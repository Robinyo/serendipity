import { Injectable } from '@angular/core';
// import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CollectionService } from '../collection/collection';

import {ASSIGNMENT, COMPLETION, FORM, SEARCH, USER_TASKS} from './constants';

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

}
