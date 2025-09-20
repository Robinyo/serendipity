import { Injectable } from '@angular/core';

import { Adapter, LoggerService } from 'serendipity-utils-lib';

import { ActivityModel } from '../models/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesAdapter implements Adapter<ActivityModel> {

  constructor(private logger: LoggerService) {

    this.logger.info('ContactAdapter initialised');
  }

  adapt(item: any): ActivityModel {

    this.logger.info('item: ' + JSON.stringify(item, null, 2));

    const activity = new ActivityModel(
      item.id,
      'Task',
      item.name,
      item.description,
      'Normal',
      item.createTime,
      item.dueDate
    );

    // this.logger.info('activity: ' + JSON.stringify(activity, null, 2));

    return activity;
  }

}
