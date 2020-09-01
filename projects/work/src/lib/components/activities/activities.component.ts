import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from 'auth';
import { StartProcessDialogComponent } from 'flowable';
import { CollectionComponent, SnackBarComponent } from 'serendipity-components';

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
export class ActivitiesComponent extends CollectionComponent<Activity> implements OnInit {

  public currentUser: any;

  constructor(private authService: AuthService,
              private entityAdapter: ActivitiesAdapter,
              private entityService: ActivitiesService,
              private snackBar: MatSnackBar) {

    super({
      columnDefsFilename: ACTIVITIES_COLUMN_DEFS,
      desktopDeviceColumns: ACTIVITIES_COLUMNS_DESKTOP,
      mobileDeviceColumns: ACTIVITIES_COLUMNS_MOBILE,
      limit: 10
    });

  }

  ngOnInit() {

    super.ngOnInit();

    this.logger.info('ActivitiesComponent: ngOnInit()');

    this.currentUser = this.authService.getCurrentUser();

    this.logger.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));
  }

  protected subscribe() {

    this.logger.info('ActivitiesComponent: subscribe()');

    this.currentUser = this.authService.getCurrentUser();

    this.subscription = this.entityService.find().subscribe(

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

      });

  }

  //
  // Command Bar events
  //

  public onAppointment() {

    // this.logger.info('ActivitiesComponent: onAppointment()');

    this.startSimpleTask('Appointment');
  }

  public onEmail() {

    // this.logger.info('ActivitiesComponent: onEmail()');

    this.startSimpleTask('Email');

    // this.router.navigate(['work/email']);
  }

  public onPhone() {

    // this.logger.info('ActivitiesComponent: onPhone()');

    this.startSimpleTask('Phone Call');
  }

  public onRefresh() {

    // this.logger.info('ActivitiesComponent: onRefresh()');

    this.openSnackBar('Refresh...');

    super.refresh();
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

  //
  // Misc
  //

  private openSnackBar(message: string) {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

  private startSimpleTask(name: string = 'Simple Task',
                          description: string = '') {

    this.logger.info('ActivitiesComponent: startSimpleTask()');

    const dueDate = addDays(new Date(), 2);

    const taskModel = {
      'name': name,
      'description': description,
      'dueDate': dueDate.toISOString(),
      'variables': [
        {
          'name': 'initiator',
          'type' : 'string',
          'value': 'flowable',
          'scope' : 'local'
        }
      ]
    };

    this.logger.info('taskModel: ' + JSON.stringify(taskModel, null, 2));

    this.entityService.startTask(taskModel).then((responce) => {

      this.openSnackBar('Task started');

      const taskAction = {
        assignee: 'flowable',
        assignment: 'involved'
      };

      this.logger.info('taskAction: ' + JSON.stringify(taskAction, null, 2));

      this.entityService.updateTask(responce.id, taskAction);

      super.refresh();

    });

  }

}

function addDays(date, days) {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
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
