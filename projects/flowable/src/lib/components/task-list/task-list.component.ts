import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription} from 'rxjs';
import { tap } from 'rxjs/operators';

import { TaskListService } from '../../services/task-list/task-list.service';
import { TaskModel, TaskListModel } from '../../models/task-list.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'flow-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  public items: TaskModel[];
  public selectedItem: TaskModel;

  constructor(private taskListService: TaskListService,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('TaskListComponent: ngOnInit()');

    this.subscribe();
  }

  protected subscribe() {

    this.logger.info('TaskListComponent: subscribe()');

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.taskListService.getTasks().subscribe(model => {

      // this.logger.info(JSON.stringify(model));
      this.items = model.data;
      this.selectedItem = this.items[0];
    });

  }

  protected unsubscribe(): void {

    this.logger.info('TaskListComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public onSelect(task: TaskModel) {

    this.logger.info('TaskListComponent: onSelect()');

    this.selectedItem = task;
  }

  public ngOnDestroy() {

    this.logger.info('TaskListComponent: ngOnDestroy()');
    this.unsubscribe();
  }
}
