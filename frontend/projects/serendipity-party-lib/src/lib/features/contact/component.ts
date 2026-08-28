import { Directive, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { LoggerService } from 'serendipity-utils-lib';

@Directive()
export abstract class AbstractComponent {

  // Reactive Status Flags managed as true Angular Signals
  public isLoading = signal<boolean>(true);

  protected logger: LoggerService = inject(LoggerService);
  protected router: Router = inject(Router);

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  // THE BREAKPOINT SIGNAL: Convert the observable query directly into a Signal!
  // Angular automatically manages the subscription and tears it down natively on destroy.
  public handsetPortrait = toSignal(
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait]).pipe(
      map(result => result.matches)
    ),
    { initialValue: false } // Safe fallback startup baseline
  );

  protected constructor() {}

  public isHandsetPortrait(): boolean {
    return this.handsetPortrait();
  }

}



/*



*/

/*

import { AfterViewInit, ChangeDetectorRef, Directive, inject, isDevMode, OnDestroy } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoggerService } from 'serendipity-utils-lib';

const noop = (): any => undefined;

@Directive()
export abstract class AbstractComponent implements AfterViewInit, OnDestroy {

  public isLoading: boolean = true;

  protected breakpointObserver: BreakpointObserver  = inject(BreakpointObserver);
  protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected destroyed: Subject<void> = new Subject<void>();
  protected handsetPortrait: boolean = false;
  protected logger = inject(LoggerService);

  protected subscriptions: Subscription[] = [];

  public ngAfterViewInit() {

    this.logger.info('Abstract Component: ngAfterViewInit()');

    this.subscribe();

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

  public refresh(): void {

    this.logger.info('Abstract Component: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public ngOnDestroy() {

    this.logger.info('Abstract Component: ngOnDestroy()');

    this.unsubscribe();

    this.destroyed.next();
    this.destroyed.complete();
  }

  protected constructor() {}

  protected abstract subscribe(): void;

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

  protected unsubscribe(): void {

    this.logger.info('Abstract Component: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  //
  // Misc
  //

  public isHandsetPortrait() {
    return this.handsetPortrait;
  }

}

*/

/*

  // protected dialogService: DialogService = inject(DialogService);
  // protected authService: AuthService = inject(AuthService);

  // protected route: ActivatedRoute = inject(ActivatedRoute);
  // protected router: Router = inject(Router);
  // protected snackBar: MatSnackBar = inject(MatSnackBar);

*/
