import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TasksService } from 'serendipity-flowable-lib';
import { LoggerService } from 'serendipity-utils-lib';

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

    this.logger.info('Activities Service: getActivities()');

    return this.tasksService.find(params);
  }

  public startTask(request: any): Promise<any> {

    this.logger.info('Activities Service: getActivities()');

    return this.tasksService.startTask(request);
  }

  public updateTask(id: string, request: any): Promise<any> {

    this.logger.info('Activities Service: updateTask()');

    return this.tasksService.updateSimpleTask(id, request);
  }

}
