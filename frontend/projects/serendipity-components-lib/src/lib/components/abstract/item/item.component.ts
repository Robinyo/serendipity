import { AfterViewInit, Directive, Injector, OnDestroy, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// import { TranslateService } from '@ngx-translate/core';

import { LoggerService, StaticInjectorService } from 'utils-lib';

import { DialogService } from '../../../services/dialogs/dialog.service';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ItemComponent<T> implements OnInit, AfterViewInit, OnDestroy {

  public id!: string;
  public item!: T;

  protected breakpointObserver: BreakpointObserver;
  protected dialogService: DialogService;
  protected logger: LoggerService;

  protected route: ActivatedRoute;
  protected router: Router;
  protected handsetPortrait: boolean = false;
  protected snackBar: MatSnackBar;
  protected subscriptions: Subscription[] = [];
  // protected translate: TranslateService;

  constructor(route: ActivatedRoute) {

    this.route = route;

    const injector: Injector = StaticInjectorService.getInjector();

    this.breakpointObserver = injector.get<BreakpointObserver>(BreakpointObserver as Type<BreakpointObserver>);
    this.dialogService = injector.get<DialogService>(DialogService as Type<DialogService>);
    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
    this.router = injector.get<Router>(Router as Type<Router>);
    this.snackBar = injector.get<MatSnackBar>(MatSnackBar as Type<MatSnackBar>);
    // this.translate = injector.get<TranslateService>(TranslateService as Type<TranslateService>);
  }

  public ngOnInit() {

    this.logger.info('ItemComponent: ngOnInit()');

    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

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

    this.logger.info('ItemComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngAfterViewInit() {

    this.logger.info('ItemComponent: ngAfterViewInit()');

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
