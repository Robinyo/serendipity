import { AfterViewInit, ChangeDetectorRef, Component, inject, isDevMode, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subject } from 'rxjs';

import { CommandBar, SnackBar } from 'serendipity-components-lib';
import { TaskList } from 'serendipity-flowable-lib';
import { LoggerService } from 'serendipity-utils-lib';

import { ACTIVITIES } from './constants';
import {takeUntil} from 'rxjs/operators';

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
export class Tasks implements AfterViewInit, OnDestroy {

  protected breakpointObserver: BreakpointObserver  = inject(BreakpointObserver);
  protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected handsetPortrait: boolean = false;
  protected logger = inject(LoggerService);
  protected router: Router = inject(Router);

  private destroyed: Subject<void> = new Subject<void>();

  protected detectChanges() {

    // The error "Expression has changed after it was checked" in Angular, specifically with an Angular Material
    // table's dataSource, indicates that a binding expression's value changed during or immediately after
    // Angular's change detection cycle, but before the view could be re-rendered to reflect this change.
    // This error typically occurs in development mode, where Angular performs an extra check to ensure view stability.

    if (isDevMode()) {
      return this.changeDetector.detectChanges();
    } else {
      return noop;
    }

  }

  public ngAfterViewInit() {

    this.logger.info('Tasks Component: ngAfterViewInit()');

    // A layout breakpoint is viewport size threshold at which a layout shift can occur.
    // The viewport size ranges between breakpoints correspond to different standard screen sizes.
    // See: https://material.angular.dev/cdk/layout/overview

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {

        this.handsetPortrait = result.matches;
        this.detectChanges();

      });

  }

  public ngOnDestroy(): void {

    this.destroyed.next();
    this.destroyed.complete();

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

  //
  // Misc
  //

  public isHandsetPortrait() {
    return this.handsetPortrait;
  }

}
