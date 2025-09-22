import { AfterViewInit, Directive, OnDestroy, inject } from '@angular/core';

import { Subscription } from 'rxjs';

import { LoggerService } from 'serendipity-utils-lib';

import { DialogService } from '../../../services/dialogs/dialog';

@Directive()
export abstract class List<T> implements AfterViewInit, OnDestroy {

  public items!: Array<T>;
  public selectedItem!: T;

  protected dialogService: DialogService = inject(DialogService);
  protected logger = inject(LoggerService);
  protected subscription: Subscription | undefined;

  protected constructor() {}

  public ngAfterViewInit(): void {

    this.logger.info('List Component: ngAfterViewInit()');

    this.subscribe();

  }

  protected abstract subscribe(): void;

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
