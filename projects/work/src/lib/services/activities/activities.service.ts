import { Injectable } from '@angular/core';

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

  public getActivities(): Observable<any> {

    this.logger.info('ActivitiesService: getActivities()');

    return this.tasksService.getTasks();

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
