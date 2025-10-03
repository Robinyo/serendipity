import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CommandBar, Composite, SnackBar } from 'serendipity-components-lib';
import { TaskList } from 'serendipity-flowable-lib';

import { ACTIVITIES } from './constants';

const noop = (): any => undefined;

@Component({
  selector: 'workflow-tasks',
  imports: [
    CommandBar,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TaskList
  ],
  templateUrl: './tasks.html',
  standalone: true,
  styleUrl: './tasks.scss'
})
export class Tasks extends Composite {

  protected router: Router = inject(Router);

  constructor() {

    super();

    this.logger.info('Tasks Component: constructor()');

  }

  //
  // Command Bar events
  //

  public onAppointment() {

    this.logger.info('Tasks Component: onAppointment()');

  }

  public onClose() {

    this.logger.info('Tasks Component: onClose()');

    this.router.navigate([ACTIVITIES]);
  }

  public onEmail() {

    this.logger.info('Tasks Component: onEmail()');

  }

  public onPhone() {

    this.logger.info('Tasks Component: onPhone()');

  }

  public onTask() {

    this.logger.info('Tasks Component: onTask()');

  }

}
