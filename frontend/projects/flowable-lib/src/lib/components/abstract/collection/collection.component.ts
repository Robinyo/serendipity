import { Directive, Injector, OnInit, OnDestroy, Type } from '@angular/core';

import { Subscription } from 'rxjs';

import { LoggerService, StaticInjectorService } from 'utils-lib';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class CollectionComponent<T> implements OnInit, OnDestroy {

  public items!: Array<T>;
  public selectedItem!: T;

  protected logger: LoggerService;
  protected subscriptions: Subscription[] = [];

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
  }

  ngOnInit(): void {
    this.subscribe();
  }

  protected abstract subscribe(): void;

  protected unsubscribe(): void {

    this.logger.info('CollectionComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

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
