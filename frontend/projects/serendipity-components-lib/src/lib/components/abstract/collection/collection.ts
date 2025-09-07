import { AfterViewInit, Directive, inject, OnInit, OnDestroy, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subscription } from 'rxjs';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

const ALPHABET: string[] = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
import { ColumnDef } from '../../../models/column';

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

export abstract class Collection<T> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort, {static: false})
  // @ts-ignore
  public sort: MatSort;

  public alphabet = ALPHABET;
  // @ts-ignore
  public columnDefs: ColumnDef[];
  // @ts-ignore
  public dataSource: MatTableDataSource<T>;
  public displayedColumns: string[] | undefined;
  public footerAllLabel = ALL;
  public footerColSpan = DEFAULT_FOOTER_COL_SPAN;
  public items!: Array<T>;
  public pageNumber = 1;
  public selectedFooterItemId = ALL;

  // protected breakpointObserver: BreakpointObserver;
  protected count = 0;
  protected configService = inject(ConfigService);
  // protected dialogService: DialogService;
  protected logger = inject(LoggerService);
  protected router = inject(Router);
  // protected sidenavService: SidenavService;
  protected subscription: Subscription | undefined;

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

  }

  public ngOnInit(): void {

    this.logger.info('CollectionComponent: ngOnInit()');

    this.loadColumnDefs(this.columnDefsFilename);
  }

  protected loadColumnDefs(configFilename: string) {

    this.logger.info('CollectionComponent: loadColumnDefs()');

    this.configService.get(configFilename).subscribe(data => {
      this.columnDefs = data;
    });

  }

  protected abstract subscribe(): void;

  protected unsubscribe(): void {

    this.logger.info('CollectionComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngAfterViewInit(): void {

    this.logger.info('CollectionComponent: ngAfterViewInit()');

  }

  public refresh(): void {

    this.logger.info('CollectionComponent: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public ngOnDestroy(): void {

  }


  //
  // Pagination events
  //

  public onClickFilterButton(id: string): void {

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

  public canClickFirstPageButton(): boolean {

    // this.logger.info('CollectionComponent: canClickFirstPageButton()');

    return this.pageNumber !== 1;
  }

  public onClickFirstPageButton(): void {

    this.logger.info('CollectionComponent: onClickFirstPageButton()');

    this.offset = 0;
    this.pageNumber = 1;

    this.refresh();
  }

  public canClickPreviousPageButton(): boolean {

    // this.logger.info('CollectionComponent: canClickPreviousPageButton()');

    // return (this.offset - this.limit) >= 0;
    return (this.offset - 1) >= 0;
  }

  public onClickPreviousPageButton(): void {

    this.logger.info('CollectionComponent: onClickPreviousPageButton()');

    // this.offset = this.offset - this.limit;
    this.offset--;

    if (this.offset < 0) {
      this.offset = 0;
    }

    this.pageNumber--;

    this.refresh();
  }

  public canClickNextPageButton(): boolean {

    // this.logger.info('CollectionComponent: canClickNextPageButton()');

    if (this.count === 0) {
      return false;
    }

    const pages = Math.ceil(this.count / this.limit);

    // this.logger.info('pages: ' + pages);
    // this.logger.info('this.pageNumber: ' + this.pageNumber);

    return (pages - this.pageNumber) > 0;
  }

  public onClickNextPageButton(): void {

    this.logger.info('CollectionComponent: onClickNextPageButton()');

    // this.offset = this.offset + this.limit;
    this.offset++;

    this.pageNumber++;

    this.refresh();
  }

  //
  // Command Bar events
  //

  public onToggleSidenav(): void {

    this.logger.info('CollectionComponent: onToggleSidenav()');

    // this.sidenavService.toggle();
  }

  //
  // Misc
  //

  public isHandsetPortrait() {
    return this.displayedColumns === this.mobileDeviceColumns;
  }

  public getFormattedCellValue(row: any, column: any) {

    // this.logger.info('CollectionComponent: getFormattedCellValue()');

    let value = this.getProperty(row, column.name);

    if (value === null || value === '') {
      return '';
    }

    switch (column.type) {

      case 'string':
        break;

      case 'date':

        const event = new Date(value);
        value = event.toLocaleDateString();
        break;

      default:

        this.logger.error('CollectionComponent getFormattedCellValue() - invalid column type');
        break;

    }

    // this.logger.info('value: ' + value);

    return value;

  }

  // https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

  public getProperty = (obj: any, path: any) => (
    path.split('.').reduce((o: any, p: any) => o && o[p], obj)
  )

}
