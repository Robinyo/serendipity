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

  public find(params: HttpParams): Observable<any> {

    this.logger.info('ActivitiesService: getActivities()');

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
