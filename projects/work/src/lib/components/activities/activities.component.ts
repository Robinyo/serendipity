import { Component } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { CollectionComponent } from 'serendipity-components';

// import { ActivitiesAdapter } from '../../adapters/activities.adapter';
// import { ActivitiesService } from '../../services/activities/activities.service';
// private entityService: ActivitiesService

import { Activity } from '../../models/activity';
import { ACTIVITIES_COLUMN_DEFS } from '../../models/column-defs';
import { ACTIVITIES_COLUMNS_DESKTOP, ACTIVITIES_COLUMNS_MOBILE } from '../../models/constants';

@Component({
  selector: 'work-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends CollectionComponent<Activity> {

  constructor() {

    super({
      columnDefsFilename: ACTIVITIES_COLUMN_DEFS,
      desktopDeviceColumns: ACTIVITIES_COLUMNS_DESKTOP,
      mobileDeviceColumns: ACTIVITIES_COLUMNS_MOBILE,
      limit: 10
    });

  }

  protected subscribe() {

    this.logger.info('ActivitiesComponent: subscribe()');

    this.items = [{
      id: '1',
      type: 'Email',
      subject: 'Welcome email',
      regarding: 'Hey',
      priority: 'Normal',
      startDate: '',
      dueDate: ''
    }, {
      id: '2',
      type: 'Phone Call',
      subject: 'Follow up re initial conversation',
      regarding: '',
      priority: 'High',
      startDate: '',
      dueDate: ''
    }, {
      id: '3',
      type: 'Task',
      subject: 'Update \'Welcome\' email template',
      regarding: 'Email templates',
      priority: 'Normal',
      startDate: '',
      dueDate: ''
    }];

    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.data = this.items;
    this.dataSource.sortingDataAccessor = pathDataAccessor;
    this.dataSource.sort = this.sort;

  }

  //
  // Command Bar events
  //

  public onEmail() {

    this.logger.info('ActivitiesComponent: onEmail()');

    // this.router.navigate(['sales/activities/email']);
  }

  public onTask() {

    this.logger.info('ActivitiesComponent: onTask()');

    // this.router.navigate(['sales/activities/tasks']);
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
  .reduce((accumulator: any, key: string) => {
    return accumulator ? accumulator[key] : undefined;
  }, item);
}
