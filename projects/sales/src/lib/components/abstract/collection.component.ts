import { Injector, OnInit, OnDestroy, Type } from '@angular/core';

import { Subscription} from 'rxjs';

import { LoggerService } from 'utils';
import { StaticInjectorService } from 'utils';

import { FAKE_ITEMS_LENGTH } from '../../models/constants';

//
// No Annotations - see: https://medium.com/@ttemplier/angular2-decorators-and-class-inheritance-905921dbd1b7#.c60rva7jo
//

export abstract class CollectionComponent implements OnInit, OnDestroy {

  protected fakeItems: Array<any> = new Array(FAKE_ITEMS_LENGTH);

  protected logger: LoggerService;

  protected subscription: Subscription;

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
  }

  public ngOnInit() {

    this.logger.info('CollectionComponent: ngOnInit()');
    this.subscribe();
  }

  protected subscribe() {
    this.logger.info('CollectionComponent: subscribe()');
  }

  protected unsubscribe() {

    this.logger.info('CollectionComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngOnDestroy() {

    this.logger.info('CollectionComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  // https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

}

/*

constructor() {

  const injector: Injector = StaticInjectorService.getInjector();

  this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
}

constructor(protected injector: Injector) {
  this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
}

*/

/*

constructor(injector: Injector) {
  this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
}

*/

/*

  public ngAfterViewInit() {

    this.logger.info('ContactsPage: ngAfterViewInit()');

    // this.containerWidth = this.tableContainer.nativeElement.offsetWidth - (MARGIN_LEFT + MARGIN_RIGHT);
    // this.containerHeight = this.tableContainer.nativeElement.offsetHeight - 160;
    // this.dataSource.sort = this.sort;
  }

*/
