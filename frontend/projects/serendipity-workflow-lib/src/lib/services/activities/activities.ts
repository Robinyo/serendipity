import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TasksService } from 'serendipity-camunda-lib';
import { LoggerService } from 'serendipity-utils-lib';

/*

Repository Query Methods (Database Actions)

To perform CRUD actions on your entity, you create a Repository interface that extends JpaRepository.
Spring Data JPA parses your custom Java method names into SQL automatically.

save(T entity): Inserts or updates an entity.
findById(ID id): Fetches an entity by its primary key.
findAll(): Retrieves all records from the table.
deleteById(ID id): Deletes a row matching the identifier.
count(): Returns the total number

find(): Retrieves the records that match the filter, sort, and page criteria.

*/

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  private logger: LoggerService = inject(LoggerService);
  private tasksService: TasksService = inject(TasksService);

  constructor() {

    this.logger.info('Activities Service: constructor()');
  }

  public find(params: HttpParams): Observable<any> {

    this.logger.info('Activities Service: find(params: HttpParams)');

    return this.tasksService.search(params);
  }

}

/*

  public startTask(request: any): Promise<any> {

    this.logger.info('Activities Service: startTask()');

    return this.tasksService.startTask(request);
  }

  public updateTask(id: string, request: any): Promise<any> {

    this.logger.info('Activities Service: updateTask()');

    return this.tasksService.updateSimpleTask(id, request);
  }

*/
