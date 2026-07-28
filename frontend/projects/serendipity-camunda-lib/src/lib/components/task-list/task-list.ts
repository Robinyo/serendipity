import { Component, inject } from '@angular/core';

import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ActivityBar, List } from 'serendipity-components-lib';

import { FormJsWrapper } from '../form-js-wrapper/form-js-wrapper';

import { TasksService } from '../../services/tasks/tasks';

@Component({
  selector: 'task-list',
  imports: [
    ActivityBar,
    MatIconModule,
    MatListModule,
    FormJsWrapper
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

          @for (item of items; track item.userTaskKey) {

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

        <form-js-wrapper [task]="selectedItem" (completeEvent)="onCompleteEvent($event)"></form-js-wrapper>

      </div>

    </div>

  `,
  styleUrl: './task-list.scss'
})
export class TaskList extends List<any> {

  private count = 0;

  private tasksService: TasksService = inject(TasksService);

  constructor() {

    super();

    this.logger.info('Task List Component: constructor()');

  }

  protected subscribe() {

    this.logger.info('Task List Component: subscribe()');

    this.isLoading = true;

    let subscription: Subscription = new Subscription();
    this.subscriptions.push(subscription);

    subscription = this.tasksService.search(this.getBody()).subscribe(

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

        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2))

        this.isLoading = false;

        this.detectChanges();

      });

  }

  private getBody(): any {

    this.logger.info('Task List Component: getBody()');

    const queryObject = {
      filter: {
        state: { $eq: "CREATED" }
      }
    };

    // this.logger.info('params: ' +  JSON.stringify(queryObject, null, 2));

    return queryObject;
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
