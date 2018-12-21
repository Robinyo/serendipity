import { Component, OnInit, Input } from '@angular/core';

import { TaskModel, TaskListModel } from '../../models/task-list.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'flow-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task: TaskModel;

  completeButton = 'COMPLETE';

  constructor(private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('TaskComponent: ngOnInit()');
  }

  public onComplete() {

    this.logger.info('TaskComponent: ngOnonCompleteInit()');
  }

}
