import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractCollectionService } from 'serendipity-utils-lib';
import { TasksService } from 'serendipity-camunda-lib';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService extends AbstractCollectionService {

  private tasksService: TasksService = inject(TasksService);

  constructor() {

    super();

    this.logger.info('Workflow Service: constructor()')

  }

  public findAllActivities(body: any): Observable<any> {

    this.logger.info('Workflow Service: findAllActivites()');

    return this.tasksService.search(body);
  }

}
