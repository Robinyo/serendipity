import { AfterViewInit, Injector, OnDestroy, Type } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { LoggerService, StaticInjectorService } from 'utils';
import { DialogService } from '../../../services/dialogs/dialog.service';

export abstract class ItemComponent<T> implements AfterViewInit, OnDestroy {

  public id: string;
  public item: T;

  protected dialogService: DialogService;
  protected logger: LoggerService;

  protected router: Router;
  protected subscriptions: Subscription[] = [];
  protected translate: TranslateService;

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.dialogService = injector.get<DialogService>(DialogService as Type<DialogService>);
    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
    this.router = injector.get<Router>(Router as Type<Router>);
    this.translate = injector.get<TranslateService>(TranslateService as Type<TranslateService>);
  }


  protected async abstract subscribe();

  protected unsubscribe() {

    this.logger.info('ItemComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngAfterViewInit() {
    this.logger.info('ItemComponent: ngAfterViewInit()');
  }

  public refresh() {

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

  public canDeactivate(): Observable<boolean> | boolean {

    // this.logger.info('ItemComponent: canDeactivate()');

    if (!this.isDirty() && this.isValid()) {
      return true;
    }

    return this.dialogService.openConfirm({
      title: 'Item',
      message: 'Are you sure you want to leave this page?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed();

  }

  public abstract isDirty();
  public abstract isValid();
  public abstract markAsPristine();

}

/*

  // protected route: ActivatedRoute;

  // this.route = injector.get<ActivatedRoute>(ActivatedRoute as Type<ActivatedRoute>);

public ngOnInit() {

  this.logger.info('ItemComponent: ngOnInit()');

  let paramSubscription: Subscription = new Subscription();
  this.subscriptions.push(paramSubscription);

  paramSubscription = this.route.paramMap.subscribe(params =>  {

    this.id = params.get('id');
    this.id = atob(this.id);

    this.logger.info('id: ' + this.id);

    this.subscribe();

  });

}

*/
