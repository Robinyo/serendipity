import { Component } from '@angular/core';

import { MatTableDataSource } from '@angular/material';

import { CollectionComponent } from '../abstract/collection.component';

// import { ActivitiesAdapter } from '../../adapters/activities.adapter';
// import { ActivitiesService } from '../../services/activities/activities.service';
// private entityService: ActivitiesService

import { Activity } from '../../models/activity';
import { ACTIVITIES_COLUMN_DEFS } from '../../models/column-defs';
import { ACTIVITIES_COLUMNS_DESKTOP, ACTIVITIES_COLUMNS_MOBILE } from '../../models/constants';

@Component({
  selector: 'sales-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends CollectionComponent<Activity> {

  constructor() {

    super();

    this.columnDefsFilename = ACTIVITIES_COLUMN_DEFS;

    this.mobileDeviceColumns = ACTIVITIES_COLUMNS_MOBILE;
    this.desktopDeviceColumns = ACTIVITIES_COLUMNS_DESKTOP;
  }

  protected subscribe() {

    this.logger.info('ActivitiesComponent: subscribe()');

    this.items = [{
      type: 'Email',
      subject: 'Welcome email',
      regarding: 'Hey',
      priority: 'Normal',
      startDate: '',
      dueDate: ''
    }, {
      type: 'Phone Call',
      subject: 'Follow up re initial conversation',
      regarding: '',
      priority: 'High',
      startDate: '',
      dueDate: ''
    }, {
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

    this.router.navigate(['sales/activities/email']);
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
  .reduce((accumulator: any, key: string) => {
    return accumulator ? accumulator[key] : undefined;
  }, item);
}

// import { EmailService } from '../../services/email/email.service';
// private emailService: EmailService
