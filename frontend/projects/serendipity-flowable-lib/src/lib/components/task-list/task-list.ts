import { Component, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ActivityBar, List } from 'serendipity-components-lib';

import { FilterRepresentationModel } from '../../models/filter';
import { TasksService } from '../../services/tasks/tasks';
import { TaskListFilter } from '../task-list-filter/task-list-filter';
import { TaskCompleteEvent, TaskListModel, TaskModel } from '../../models/task-list';

@Component({
  selector: 'workflow-task-list',
  imports: [
    ActivityBar,
    MatIconModule,
    MatListModule,
    TaskListFilter
  ],
  template: `
    <activity-bar>
      <workflow-task-list-filter (filterClick)="onFilterClickEvent($event)"> </workflow-task-list-filter>
    </activity-bar>

    <div class="md-tasks-container">

      <div class="task-list-container">

        <mat-nav-list style="padding-top: 0">

          @for (item of items; track item.id) {

            <a mat-list-item
               class="md-nav-list-item"
               [activated]="item.id === selectedItem.id"
               (click)="onSelect(item)">

              <mat-icon matListItemIcon class="material-symbols-outlined"> assignment_ind </mat-icon>

              <p>
                {{item.name}}
              </p>

            </a>

          }

        </mat-nav-list>

      </div>

      <div class="task-container">

      </div>

    </div>

  `,
  styleUrl: './task-list.scss'
})
export class TaskList extends List<TaskModel> {

  private currentUser;
  private tasksFilter: FilterRepresentationModel;

  private count = 0;
  private tasksService: TasksService = inject(TasksService);

  constructor() {

    super();

    this.logger.info('Task List Component: constructor()');

    this.currentUser = this.authService.getCurrentUser();

    this.tasksFilter = {
      name : 'I am involved',
      filter : {
        name: 'involvedUser',
        assignment: this.currentUser.username
      },
      icon : 'assignment_ind'
    };

  }

  protected subscribe() {

    this.logger.info('Task List Component: subscribe()');

    // this.isLoading = true;

    this.subscription = this.tasksService.find(this.getParams()).subscribe(

      (response: TaskListModel) => {

        this.logger.info('Task List Component: subscribe() success handler');

        if (response.data && response.data.length) {
          this.count = response.data.length;
        }

        this.logger.info('count: ' + this.count + ' Tasks');

        if (this.count > 0) {

          // @ts-ignore
          this.items = response.data;
          this.selectedItem = this.items[0];

        } else {

          this.items = [];
          // this.items.push(new TaskModel());

        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2))

      },
      (error) => {

        this.logger.error('Task List Component: subscribe() error handler');

        this.items = [];
        // this.selectedItem = null;

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      },
      () =>  {

        this.logger.info('Task List Component: subscribe() completion handler');
      }

    );

  }

  private getParams(): HttpParams {

    this.logger.info('Task List Component: getParams()');

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

  //
  // Command events
  //

  public onCompleteEvent(event: TaskCompleteEvent) {

    this.logger.info('TaskListComponent: onCompleteEvent()');

    this.logger.info('taskId: ' +  event.id);

    // this.selectedItem = null;
    this.refresh();
  }

  public onFilterClickEvent(event: FilterRepresentationModel) {

    this.logger.info('TaskListComponent: onFilterClickEvent()');

    this.logger.info('filter: ' +  JSON.stringify(event, null, 2));

    this.tasksFilter = event;
    this.refresh();
  }

}
