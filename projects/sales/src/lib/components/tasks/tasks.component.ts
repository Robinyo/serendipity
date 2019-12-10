import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { TaskListComponent } from 'flowable';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  @ViewChild(TaskListComponent, {static: false})
  private taskList: TaskListComponent;

  constructor(private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('TasksComponent: ngOnInit()');
  }

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('TasksComponent: canDeactivate()');

    return true;
  }

  //
  // Command Bar events
  //

  public onRefresh() {

    this.taskList.refresh();
  }

}

// https://angular.io/guide/router#candeactivate-handling-unsaved-changes

/*

  public canActivate(): Observable<boolean> | boolean {

    this.logger.info('ActivitiesComponent: canActivate()');

    return true;
  }

*/
