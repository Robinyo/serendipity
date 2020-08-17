import { Component } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { StartProcessDialogComponent } from 'flowable';
import { CollectionComponent } from 'serendipity-components';

import { ActivitiesAdapter } from '../../adapters/activities.adapter';
import { ActivitiesService } from '../../services/activities/activities.service';

import { Activity } from '../../models/activity';
import { ACTIVITIES_COLUMN_DEFS } from '../../models/column-defs';

import {
  ACTIVITIES_COLUMNS_DESKTOP,
  ACTIVITIES_COLUMNS_MOBILE
} from '../../models/constants';

@Component({
  selector: 'work-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends CollectionComponent<Activity> {

  constructor(private entityAdapter: ActivitiesAdapter,
              private entityService: ActivitiesService) {

    super({
      columnDefsFilename: ACTIVITIES_COLUMN_DEFS,
      desktopDeviceColumns: ACTIVITIES_COLUMNS_DESKTOP,
      mobileDeviceColumns: ACTIVITIES_COLUMNS_MOBILE,
      limit: 10
    });

  }

  protected subscribe() {

    this.logger.info('ActivitiesComponent: subscribe()');

    this.subscription = this.entityService.getActivities().subscribe(

      (response: any) => {

        this.logger.info('ActivitiesComponent: subscribe() success handler');

        if (response.data && response.data.length) {

          this.logger.info('count: ' + response.data.length);

          this.items = response.data.map(
            (item => this.entityAdapter.adapt(item)));

        } else {

          this.items = [];
          this.items.push(new Activity());

        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      }

    );

  }

  //
  // Command Bar events
  //

  public onEmail() {

    this.logger.info('ActivitiesComponent: onEmail()');

    // this.router.navigate(['sales/activities/email']);
  }

  public onTask() {

    // this.logger.info('ActivitiesComponent: onTask()');

    const dialogRef =  this.dialogService.open(StartProcessDialogComponent);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        super.refresh();
      }

    });
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
  .reduce((accumulator: any, key: string) => {
    return accumulator ? accumulator[key] : undefined;
  }, item);
}

/*

@Component({
  selector: 'work-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends CollectionComponent<Activity> {

  constructor(private entityService: ActivitiesService) {

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

    // this.logger.info('ActivitiesComponent: onEmail()');

    // this.router.navigate(['sales/activities/email']);
    this.router.navigate(['sales/activities/tasks']);
  }

  public onTask() {

    // this.logger.info('ActivitiesComponent: onTask()');

    this.dialogService.open(StartProcessDialogComponent);
  }

}

*/
