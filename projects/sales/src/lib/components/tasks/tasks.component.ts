import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TaskListComponent } from 'flowable';

import { ACTIVITIES } from '../../models/constants';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  @ViewChild(TaskListComponent, {static: false})
  private taskList: TaskListComponent;

  constructor(private logger: LoggerService,
              private router: Router) {}

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

  public onClose() {

    this.logger.info('TasksComponent: onClose()');

    this.router.navigate([ACTIVITIES]);
  }

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
