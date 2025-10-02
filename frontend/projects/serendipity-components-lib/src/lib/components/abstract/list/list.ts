import {AfterViewInit, ChangeDetectorRef, Directive, OnDestroy, inject, isDevMode } from '@angular/core';

// import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { AuthService } from 'serendipity-auth-lib';
import { LoggerService } from 'serendipity-utils-lib';
import { DialogService } from '../../../services/dialogs/dialog';

const noop = (): any => undefined;

@Directive()
export abstract class List<T> implements AfterViewInit, OnDestroy {

  public items!: Array<T>;
  public selectedItem!: T;

  public isLoading: boolean = true;

  protected authService: AuthService = inject(AuthService);
  protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected dialogService: DialogService = inject(DialogService);
  protected logger = inject(LoggerService);
  protected subscription: Subscription | undefined;

  protected constructor() {}

  public ngAfterViewInit(): void {

    this.logger.info('List Component: ngAfterViewInit()');

    this.subscribe();

  }

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

    // this.logger.info('List Component: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public refresh(): void {
    this.unsubscribe();
    this.subscribe();
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  //
  // Command events
  //

  public onSelect(item: T): void {
    this.selectedItem = item;
  }

}
