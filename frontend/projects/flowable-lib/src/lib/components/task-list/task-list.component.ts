import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from 'auth-lib';
import { DialogService} from 'serendipity-components-lib';

import { TasksService } from '../../services/tasks/tasks.service';

import { CollectionComponent } from '../abstract/collection/collection.component';
import { FilterRepresentationModel } from '../../models/filter.model';
import { TaskCompleteEvent, TaskListModel, TaskModel } from '../../models/task-list.model';

@Component({
  selector: 'flow-task-list',
  template: `
    <activity-bar>

      <flow-task-list-filter (filterClick)="onFilterClickEvent($event)"> </flow-task-list-filter>

    </activity-bar>

    <div class="md-activities-container">

      <div class="md-task-list-container">

        <mat-nav-list style="padding-top: 0">

          <a *ngFor="let item of items"
             mat-list-item
             [class.list-item-active]="item === selectedItem"
             (click)="onSelect(item)">

            <mat-icon matListIcon svgIcon="assignment-ind" class="task-list-icon"> </mat-icon>

            <p mat-line>
              {{item.name}}
            </p>

          </a>

        </mat-nav-list>

      </div>

      <div class="md-task-container">
        <flow-task (completeEvent)="onCompleteEvent($event)" [task]="selectedItem"> </flow-task>
      </div>

    </div>
  `,
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent extends CollectionComponent<TaskModel> {

  private currentUser;
  private tasksFilter: FilterRepresentationModel;

  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private tasksService: TasksService) {
    super();

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

  protected subscribe() {

    this.logger.info('TaskListComponent: subscribe()');

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.tasksService.find(this.getParams()).subscribe(

      (model: TaskListModel) => {

        this.logger.info('TaskListComponent: subscribe() success handler');

        if (model.data) {
          this.items = model.data;
        }

        if (this.items && this.items.length) {
          this.selectedItem = this.items[0];
        }

      });

  }

  private getParams(): HttpParams {

    this.logger.info('TaskListComponent: getParams()');

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

}
