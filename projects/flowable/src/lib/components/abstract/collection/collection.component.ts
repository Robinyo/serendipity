import { Directive, Injector, OnInit, OnDestroy, Type } from '@angular/core';

import { Subscription } from 'rxjs';

import { LoggerService, StaticInjectorService } from 'utils';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class CollectionComponent<T> implements OnInit, OnDestroy {

  public items: Array<T>;
  public selectedItem: T = null;

  protected logger: LoggerService;
  protected subscriptions: Subscription[] = [];

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
  }

  ngOnInit(): void {
    this.subscribe();
  }

  protected abstract subscribe();

  protected unsubscribe() {

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public refresh() {
    this.unsubscribe();
    this.subscribe();
  }

  public ngOnDestroy() {
    this.unsubscribe();
  }

  //
  // Command events
  //

  public onSelect(item: T) {
    this.selectedItem = item;
  }

}
