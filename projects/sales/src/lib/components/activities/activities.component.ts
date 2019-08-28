import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { TaskListComponent } from 'flowable';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  @ViewChild(TaskListComponent, {static: false})
  private taskList: TaskListComponent;

  constructor(private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('ActivitiesComponent: ngOnInit()');
  }

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('ActivitiesComponent: canDeactivate()');

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
