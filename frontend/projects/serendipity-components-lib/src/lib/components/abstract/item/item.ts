import { AfterViewInit, Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { LoggerService } from 'serendipity-utils-lib';

import { DialogService } from '../../../services/dialogs/dialog';

@Directive()
export abstract class Item<T> implements OnInit, AfterViewInit, OnDestroy {

  public id!: string;
  public item!: T;

  protected breakpointObserver: BreakpointObserver  = inject(BreakpointObserver);
  protected dialogService: DialogService = inject(DialogService);
  protected logger = inject(LoggerService);
  protected router: Router = inject(Router);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  protected handsetPortrait: boolean = false;
  protected route: ActivatedRoute | undefined;
  protected subscriptions: Subscription[] = [];

  public ngOnInit() {

    this.logger.info('Item Component: ngOnInit()');

    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    // @ts-ignore
    paramSubscription = this.route.paramMap.subscribe(params =>  {

      const identity = params.get('id');

      if (identity != null) {
        this.id = atob(identity);
      }

      this.logger.info('id: ' + this.id);

      this.subscribe();

    });

  }

  protected abstract subscribe(): void;

  protected unsubscribe(): void {

    this.logger.info('Item Component: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngAfterViewInit() {

    this.logger.info('Item Component: ngAfterViewInit()');

    // React to changes to the viewport

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {
      this.handsetPortrait = result.matches;
    });

  }

  public refresh(): void {

    this.logger.info('ItemComponent: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public ngOnDestroy() {

    this.logger.info('ItemComponent: ngOnDestroy()');

    this.unsubscribe();
  }

  //
  // Validation
  //

  public abstract canDeactivate(): Observable<boolean> | boolean ;
  public abstract isDirty(): boolean;
  public abstract isValid(): boolean;
  public abstract markAsPristine(): void;

  //
  // Misc
  //

  public isHandsetPortrait() {
    return this.handsetPortrait;
  }

}
