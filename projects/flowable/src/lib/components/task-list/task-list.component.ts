import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription} from 'rxjs';
import { tap } from 'rxjs/operators';

import { TaskListService } from '../../services/task-list/task-list.service';
import { TaskListModel } from '../../models/task-list.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'flow-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  public items: TaskListModel;

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

    modelSubscription = this.taskListService.getTasks().subscribe(data => {

      this.logger.info(JSON.stringify(data));
      this.items = data;
    });

  }

  protected unsubscribe(): void {

    this.logger.info('TaskListComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('TaskListComponent: ngOnDestroy()');
    this.unsubscribe();
  }
}
