import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TaskListComponent } from 'flowable-lib';
import { LoggerService } from 'utils-lib';

// import { ACTIVITIES } from '../../models/constants';

@Component({
  selector: 'work-tasks',
  template: `
    <command-bar>

      <button mat-flat-button class="md-command-bar-button"
              [disabled]="true">
        <mat-icon svgIcon="assignment"> </mat-icon>
        <span i18n="Command Bar Item|Activities@@TASKS">
      TASKS
    </span>
      </button>

      <button mat-flat-button class="md-command-bar-button"
              [disabled]="true">
        <mat-icon svgIcon="email"> </mat-icon>
        <span i18n="Command Bar Item|Activities@@EMAIL">
      EMAIL
    </span>
      </button>

      <button mat-flat-button class="md-command-bar-button"
              [disabled]="true">
        <mat-icon svgIcon="today"> </mat-icon>
        <span i18n="Command Bar Item|Activities@@APPOINTMENT">
      APPOINTMENT
    </span>
      </button>

      <button mat-flat-button class="md-command-bar-button"
              [disabled]="true">
        <mat-icon svgIcon="phone"> </mat-icon>
        <span i18n="Command Bar Item|Activities@@PHONE_CALL">
      PHONE CALL
    </span>
      </button>

    </command-bar>

    <flow-task-list> </flow-task-list>
  `
})
export class TasksComponent implements OnInit {

  @ViewChild(TaskListComponent, {static: false})
  private taskList!: TaskListComponent;

  constructor(private logger: LoggerService,
              private router: Router) {}

  ngOnInit() {

    this.logger.info('TasksComponent: ngOnInit()');
  }

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('TasksComponent: canDeactivate()');

    return true;
  }

}

// https://angular.io/guide/router#candeactivate-handling-unsaved-changes

/*

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

  public canActivate(): Observable<boolean> | boolean {

    this.logger.info('ActivitiesComponent: canActivate()');

    return true;
  }

*/
