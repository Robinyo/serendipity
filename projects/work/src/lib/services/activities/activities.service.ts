import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TasksService } from 'flowable';
import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private tasksService: TasksService,
              private logger: LoggerService) {
  }

  public find(): Observable<any> {

    this.logger.info('ActivitiesService: getActivities()');

    // https://www.flowable.org/docs/userguide/index.html#_request_parameters
    // https://flowable.com/open-source/docs/bpmn/ch15-REST/#list-of-tasks
    const sort = 'createTime';
    const order = 'desc'; // 'asc | desc'
    // const start = 0;
    // const size = 16;

    const params = new HttpParams().set('excludeSubTasks', 'true').set('sort', sort).set('order', order);

    return this.tasksService.find(params);
  }

  public startTask(request: any): Promise<any> {

    this.logger.info('ActivitiesService: getActivities()');

    return this.tasksService.startTask(request);
  }

  public updateTask(id: string, request: any): Promise<any> {

    this.logger.info('ActivitiesService: updateTask()');

    return this.tasksService.updateSimpleTask(id, request);
  }

}

/*

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TasksService } from 'flowable';
import { CollectionService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends CollectionService {

  constructor(private tasksService: TasksService) {
    super();
  }

  public getActivities(): Observable<any> {

    this.logger.info('ActivitiesService: getTasks()');

    return this.tasksService.getTasks();

  }

}

*/
