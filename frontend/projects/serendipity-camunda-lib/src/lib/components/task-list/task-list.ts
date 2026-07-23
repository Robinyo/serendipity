import { Component, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ActivityBar, List } from 'serendipity-components-lib';

// import { FilterRepresentationModel } from '../../models/filter';
// import { Task } from '../task/task';
import { TasksService } from '../../services/tasks/tasks';
// import { TaskListFilter } from '../task-list-filter/task-list-filter';
// import { TaskCompleteEvent, TaskListModel, TaskModel } from '../../models/task-list';

@Component({
  selector: 'workflow-task-list',
  imports: [
    ActivityBar,
    MatIconModule,
    MatListModule
    // Task,
    // TaskListFilter
  ],
  template: `
    <activity-bar>
      <span class="md-font-headline-lg" aria-label="Activity Bar Title">
        Tasks
      </span>
    </activity-bar>

    <div class="md-tasks-container">

      <div class="task-list-container">

        <mat-nav-list class="task-list">

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

        <!-- <workflow-task (completeEvent)="onCompleteEvent($event)" [task]="selectedItem"></workflow-task> -->

      </div>

    </div>

  `,
  styleUrl: './task-list.scss'
})
export class TaskList extends List<any> {

  // private currentUser;

  private count = 0;
  private tasksService: TasksService = inject(TasksService);

  constructor() {

    super();

    this.logger.info('Task List Component: constructor()');

    // this.currentUser = this.authService.getCurrentUser();

  }

  protected subscribe() {

    this.logger.info('Task List Component: subscribe()');

    this.isLoading = true;

    let subscription: Subscription = new Subscription();
    this.subscriptions.push(subscription);

    subscription = this.tasksService.search(this.getParams()).subscribe(

      (response: any) => {

        this.logger.info('Task List Component: subscribe() success handler');

        if (response.page && response.page.totalItems) {
          this.count = response.page.totalItems;
        }

        this.logger.info('count: ' + this.count + ' Tasks');

        if (this.count > 0) {

          // @ts-ignore
          this.items = response.items;
          this.selectedItem = this.items[0];

        } else {

          this.items = [];
          // this.items.push(new TaskModel());

        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2))

        this.isLoading = false;

        this.detectChanges();

      });

  }

  private getParams(): HttpParams {

    this.logger.info('Task List Component: getParams()');

    const params = new HttpParams();

    this.logger.info('params: ' +  JSON.stringify(params, null, 2));

    return params;
  }

  //
  // Command events
  //

  public onCompleteEvent(event: any) {

    this.logger.info('TaskListComponent: onCompleteEvent()');

    this.logger.info('taskId: ' +  event.id);

    // this.selectedItem = null;
    this.refresh();
  }

  public onFilterClickEvent(event: any) {

    this.logger.info('TaskListComponent: onFilterClickEvent()');

    this.logger.info('filter: ' +  JSON.stringify(event, null, 2));

    // this.tasksFilter = event;
    this.refresh();
  }

}
