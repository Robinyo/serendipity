import { AfterViewInit, Injector, OnInit, OnDestroy, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subscription} from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { ConfigService, LoggerService, StaticInjectorService } from 'utils';
import { DialogService } from '../../../services/dialogs/dialog.service';
import { SidenavService } from '../../../services/sidenav/sidenav.service';

import { ALPHABET } from '../../../models/constants';
import { ColumnDef } from '../../../models/column';
// import { FAKE_ITEMS_LENGTH } from '../../models/constants';

const ALL = 'All';
const DEFAULT_FOOTER_COL_SPAN = 5;

export interface CollectionComponentConfig {

  // Mandatory items

  columnDefsFilename: string;
  desktopDeviceColumns: string[];
  mobileDeviceColumns: string[];

  // Optional items

  filter?: string;
  limit?: number;
  offset?: number;

}

export abstract class CollectionComponent<T> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort, {static: false})
  public sort: MatSort;

  public alphabet = ALPHABET;
  public columnDefs: ColumnDef[];
  public dataSource: MatTableDataSource<T>;
  public displayedColumns: string[];
  public footerAllLabel = ALL;
  public footerColSpan = DEFAULT_FOOTER_COL_SPAN;
  public items: Array<T>;
  public pageNumber = 1;
  public selectedFooterItemId = ALL;

  protected breakpointObserver: BreakpointObserver;
  protected count = 0;
  protected configService: ConfigService;
  protected dialogService: DialogService;
  // protected fakeItems: Array<any> = new Array(FAKE_ITEMS_LENGTH);
  protected logger: LoggerService;
  protected router: Router;
  protected sidenavService: SidenavService;
  protected subscription: Subscription;
  protected translate: TranslateService;

  protected filter = '';
  protected limit = 100;
  protected offset = 0;

  protected columnDefsFilename: string;
  protected desktopDeviceColumns: string[];
  protected mobileDeviceColumns: string[];

  constructor(config: CollectionComponentConfig) {

    this.columnDefsFilename = config.columnDefsFilename;
    this.desktopDeviceColumns = config.desktopDeviceColumns;
    this.mobileDeviceColumns = config.mobileDeviceColumns;

    if (config.filter !== undefined) {
      this.filter = config.filter;
    }

    if (config.limit !== undefined) {
      this.limit = config.limit;
    }

    if (config.offset !== undefined) {
      this.offset = config.offset;
    }

    const injector: Injector = StaticInjectorService.getInjector();

    this.breakpointObserver = injector.get<BreakpointObserver>(BreakpointObserver as Type<BreakpointObserver>);
    this.configService = injector.get<ConfigService>(ConfigService as Type<ConfigService>);
    this.dialogService = injector.get<DialogService>(DialogService as Type<DialogService>);
    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
    this.router = injector.get<Router>(Router as Type<Router>);
    this.sidenavService = injector.get<SidenavService>(SidenavService as Type<SidenavService>);
    this.translate = injector.get<TranslateService>(TranslateService as Type<TranslateService>);
  }

  public ngOnInit() {

    this.logger.info('CollectionComponent: ngOnInit()');

    this.loadColumnDefs(this.columnDefsFilename).then(() => {
      this.subscribe();
    });

  }

  protected async loadColumnDefs(configFilename: string): Promise<any> {

    this.logger.info('CollectionComponent: loadColumnDefs()');

    this.columnDefs = await this.configService.get(configFilename);

    this.columnDefs.forEach(column => {

      this.translate.get(column.displayName).subscribe(value => {
        column.displayName = value;
      });

    });

  }

  protected abstract subscribe();

  protected unsubscribe() {

    this.logger.info('CollectionComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngAfterViewInit() {

    this.logger.info('CollectionComponent: ngAfterViewInit()');

    // React to changes to the viewport

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {

      if (result.matches) {
        this.displayedColumns = this.mobileDeviceColumns;
      } else {
        this.displayedColumns = this.desktopDeviceColumns;
      }

      this.footerColSpan = this.displayedColumns.length;

      // this.logger.info('footerColSpan: ' + this.footerColSpan);
    });

  }

  public refresh() {

    this.logger.info('CollectionComponent: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public ngOnDestroy() {

    this.logger.info('CollectionComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  //
  // Pagination events
  //

  public onClickFilterButton(id: string) {

    this.logger.info('CollectionComponent: onClickFilterButton()');

    this.logger.info('Button Id: ' + id);

    this.selectedFooterItemId = id;

    this.filter = this.selectedFooterItemId;

    if (this.selectedFooterItemId === this.footerAllLabel) {
      this.filter = '';
    }

    // this.logger.info('Filter value: ' + id);

    this.offset = 0;
    this.pageNumber = 1;

    this.refresh();
  }

  public canClickFirstPageButton() {

    // this.logger.info('CollectionComponent: canClickFirstPageButton()');

    return this.pageNumber !== 1;
  }

  public onClickFirstPageButton() {

    this.logger.info('CollectionComponent: onClickFirstPageButton()');

    this.offset = 0;
    this.pageNumber = 1;

    this.refresh();
  }

  public canClickPreviousPageButton() {

    // this.logger.info('CollectionComponent: canClickPreviousPageButton()');

    return (this.offset - this.limit) >= 0;
  }

  public onClickPreviousPageButton() {

    this.logger.info('CollectionComponent: onClickPreviousPageButton()');

    this.offset = this.offset - this.limit;

    if (this.offset < 0) {
      this.offset = 0;
    }

    this.pageNumber--;

    this.refresh();
  }

  public canClickNextPageButton() {

    // this.logger.info('CollectionComponent: canClickNextPageButton()');

    if (this.count === 0) {
      return false;
    }

    const pages = Math.ceil(this.count / this.limit);

    // this.logger.info('pages: ' + pages);
    // this.logger.info('this.pageNumber: ' + this.pageNumber);

    return (pages - this.pageNumber) > 0;
  }

  public onClickNextPageButton() {

    this.logger.info('CollectionComponent: onClickNextPageButton()');

    this.offset = this.offset + this.limit;

    this.pageNumber++;

    this.refresh();
  }

  //
  // Command Bar events
  //

  public onToggleSidenav() {

    this.logger.info('CollectionComponent: onToggleSidenav()');

    this.sidenavService.toggle();
  }

  //
  // Misc
  //

  // https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

  public getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

}
