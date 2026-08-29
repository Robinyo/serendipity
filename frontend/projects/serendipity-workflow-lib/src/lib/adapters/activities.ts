import { inject, Injectable } from '@angular/core';

import { Adapter, LoggerService } from 'serendipity-utils-lib';

import { ActivityModel, createDefaultActivityModel } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesAdapter implements Adapter<ActivityModel> {

  protected logger = inject(LoggerService);

  adapt(item: any): ActivityModel {

    this.logger.info('item: ' + JSON.stringify(item, null, 2));

    const type = 'Task';
    const priority = 'Medium';  // A value between 0 and 100

    const activity = createDefaultActivityModel();

    activity.id = item.userTaskKey;
    activity.type = type;
    activity.subject = item.name;
    activity.regarding = item.description;
    activity.priority = priority;
    activity.startDate = item.creationDate;
    activity.dueDate = item.dueDate;

    // this.logger.info('activity: ' + JSON.stringify(activity, null, 2));

    return activity;
  }

}
