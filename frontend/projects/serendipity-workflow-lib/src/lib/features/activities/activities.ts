import { inject, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { FilterRepresentationModel, StartProcessDialog } from 'serendipity-flowable-lib';
import { ActivityBar, CommandBar, Collection, CollectionFooter, SnackBar } from 'serendipity-components-lib';

import { ActivitiesAdapter } from '../../adapters/activities';
import { ActivitiesService } from '../../services/activities/activities';

import { ActivityModel } from '../../models/activity';

import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './column-defs';

@Component({
  selector: 'activities',
  imports: [
    ActivityBar,
    CommandBar,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    CollectionFooter,
    RouterLink
  ],
  templateUrl: './activities.html',
  standalone: true,
  styleUrl: './activities.scss'
})
export class Activities extends Collection<ActivityModel> {

  public currentUser: any;

  private entityAdapter: ActivitiesAdapter = inject(ActivitiesAdapter);
  private entityService: ActivitiesService = inject(ActivitiesService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  private tasksFilter: FilterRepresentationModel;

  constructor() {

    super({
      // columnDefsFilename: COLUMN_DEFS,
      columnDefsFilename: "",
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE,
      limit: 10
    });

    this.logger.info('Activities Component: constructor()');

    this.columnDefs = this.route.snapshot.data['columnDefs'];

    // this.logger.info('columnDefs: ' + JSON.stringify(this.columnDefs, null, 2));

    this.currentUser = this.authService.getCurrentUser();

    this.tasksFilter = {
      name : 'I am one of the candidates',
      filter : {
        // name: 'candidateUser',
        name: 'candidate',
        assignment: this.currentUser.username
      },
      icon : 'assignment_ind'
    };

  }

  protected subscribe() {

    this.logger.info('Activities Component: subscribe()');

    this.isLoading = true;

    let subscription: Subscription = new Subscription();
    this.subscriptions.push(subscription);

    subscription = this.entityService.find(this.getParams()).subscribe(

      (response: any) => {

        this.logger.info('ActivitiesComponent: subscribe() success handler');

        if (response.data && response.data.length) {
          this.count = response.data.length;
        }

        this.logger.info('count: ' + this.count + ' Activities');

        if (this.count > 0) {

          this.items = response.data.map(
            ((item: any) => this.entityAdapter.adapt(item)));

        } else {

          this.items = [];
          this.items.push(new ActivityModel());

        }

        this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

        this.isLoading = false;

        this.detectChanges();

      });

  }

  private getParams() {
    // return new HttpParams();
    return undefined;
  }

  /*

  private getParams() {

    this.logger.info('Activities Component: getParams()');

    // this.logger.info('filter: ' +  JSON.stringify(this.filter, null, 2));

    const excludeSubTasks = 'true';
    const order = 'desc';            // 'asc | desc
    // const size = 16;
    // const start = 0;              // page
    const sort = 'createTime';

    let params: HttpParams;

    if (this.tasksFilter.filter && this.tasksFilter.filter.name && this.tasksFilter.filter.assignment) {

      params = new HttpParams()
        .set(this.tasksFilter.filter.name, this.tasksFilter.filter.assignment)
        .set('excludeSubTasks', excludeSubTasks)
        .set('order', order)
        .set('sort', sort);

    } else {

      params = new HttpParams()
        .set('excludeSubTasks', excludeSubTasks)
        .set('order', order)
        .set('sort', sort);

    }

    // this.logger.info('params: ' +  JSON.stringify(params, null, 2));

    return params;
  }

  */

  //
  // Command Bar events
  //

  public onAppointment() {

    // this.logger.info('Activities Component: onAppointment()');

    this.startSimpleTask('Appointment');
  }

  public onEmail() {

    // this.logger.info('Activities Component: onEmail()');

    this.startSimpleTask('Email');

    // this.router.navigate(['work/email']);
  }

  public onPhone() {

    // this.logger.info('Activities Component: onPhone()');

    this.startSimpleTask('Phone Call');
  }

  public onRefresh() {

    // this.logger.info('Activities Component: onRefresh()');

    super.refresh();

    this.openSnackBar('Refresh...');

  }

  public onTask() {

    // this.logger.info('Activities Component: onTask()');

    const dialogRef =  this.dialogService.open(StartProcessDialog);

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

    this.snackBar.openFromComponent(SnackBar, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'md-snack-bar'
    });

  }

  private startSimpleTask(name: string = 'Simple Task',
                          description: string = '') {

    this.logger.info('Activities Component: startSimpleTask()');

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // @ts-ignore
    const dueDate = addDays(new Date(), 2).toLocaleString('en-GB', options);

    const taskModel = {
      name: name,
      description: description,
      dueDate: dueDate,
      variables: [
        {
          'name': 'initiator',
          'type' : 'string',
           value: this.currentUser.username,
          'scope' : 'local'
        }
      ]
    };

    this.logger.info('taskModel: ' + JSON.stringify(taskModel, null, 2));

    this.entityService.startTask(taskModel).then((responce) => {

      this.openSnackBar('Task started');

      const taskAction = {
        assignee: this.currentUser.username,
        assignment: 'involved'
      };

      this.logger.info('taskAction: ' + JSON.stringify(taskAction, null, 2));

      this.entityService.updateTask(responce.id, taskAction);

      super.refresh();

    });

  }

}

function addDays(date: Date, days: number) {
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

    const dialogRef =  this.dialogService.open(StartProcessDialog, {
      panelClass: 'md-dialog-container'
    });

*/
