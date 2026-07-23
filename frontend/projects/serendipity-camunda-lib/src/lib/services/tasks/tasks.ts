import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CollectionService } from '../collection/collection';

import { SEARCH } from './constants';

@Injectable({
  providedIn: 'root'
})
export class TasksService extends CollectionService {

  public search(params: HttpParams): Observable<any> {

    this.logger.info('Tasks Service: search()');

    const url = this.getUrlPrefix() + SEARCH;

    this.logger.info('url: ' + url);
    this.logger.info('params: ' + params);

    return this.httpClient.post(url, params, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Tasks Service: search() completed');
      })
    );

  }

}



/*

  public search(filter: object, sort: object[], offset: number = 0, limit: number = 100): Observable<any> {

    this.logger.info('Tasks Service: find()');

    const url = this.getUrlPrefix() + SEARCH;

    const body = {
      filter: filter,
      sort: sort,
      page: {
        from: offset,
        limit: limit
      }
    };

    const params = new HttpParams()
      .set('page', '2')
      .set('sort', 'desc');

    return this.httpClient.post(url, params, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Tasks Service: search() completed');
      })
    );

  }


*/

/*

Working with User Tasks
Once a process instance is running, you can interact with user tasks via these endpoints:

Action	            Endpoint
Search/find tasks	  POST /v2/user-tasks/search
Assign a task	      POST /user-tasks/{userTaskKey}/assignment
Complete a task	    POST /user-tasks/{userTaskKey}/completion
Update a task	      PATCH /user-tasks/{userTaskKey}
Unassign a task	    DELETE /user-tasks/{userTaskKey}/assignee

*/
