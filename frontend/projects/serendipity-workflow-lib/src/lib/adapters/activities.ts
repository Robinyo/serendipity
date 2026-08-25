import { Injectable } from '@angular/core';

import { Adapter, LoggerService } from 'serendipity-utils-lib';

import { ActivityModel } from '../models/activity.js';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesAdapter implements Adapter<ActivityModel> {

  constructor(private logger: LoggerService) {

    this.logger.info('ContactAdapter initialised');
  }

  adapt(item: any): ActivityModel {

    this.logger.info('item: ' + JSON.stringify(item, null, 2));

    const type = 'Task';
    const priority = 'Medium';  // A value between 0 and 100

    const activity = new ActivityModel(
      item.userTaskKey,
      type,
      item.name,
      item.description,
      priority,
      item.creationDate,
      item.dueDate ? item.dueDate : ''
    );

    // this.logger.info('activity: ' + JSON.stringify(activity, null, 2));

    return activity;
  }

}
