import { AfterViewInit, ChangeDetectorRef, Directive, inject, isDevMode, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { DialogService } from '../../../services/dialogs/dialog';
// import { SidenavService } from '../../../services/sidenav/sidenav.service';

import { ColumnDef } from '../../../models/column';

import { ALL, ALPHABET, DEFAULT_FOOTER_COL_SPAN } from './constants';

const noop = (): any => undefined;

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

@Directive()
export abstract class Collection<T> implements AfterViewInit, OnDestroy {

  @ViewChild(MatSort, {static: false})
  public sort: MatSort | undefined;

  protected items!: Array<T>;

  public alphabet = ALPHABET;
  // @ts-ignore
  public columnDefs: ColumnDef[];
  // @ts-ignore
  public dataSource: MatTableDataSource<T>;
  public displayedColumns: string[];
  public footerAllLabel = ALL;
  public footerColSpan = DEFAULT_FOOTER_COL_SPAN;
  public isLoading: boolean = true;
  public pageNumber = 1;
  public selectedFooterItemId = ALL;

  protected breakpointObserver: BreakpointObserver  = inject(BreakpointObserver);
  protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected count = 0;
  protected configService = inject(ConfigService);
  protected dialogService: DialogService = inject(DialogService);
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

  private destroyed: Subject<void> = new Subject<void>();

  protected constructor(config: CollectionComponentConfig) {

    this.columnDefsFilename = config.columnDefsFilename;
    this.desktopDeviceColumns = config.desktopDeviceColumns;
    this.mobileDeviceColumns = config.mobileDeviceColumns;

    this.displayedColumns = this.desktopDeviceColumns;
    this.footerColSpan = this.displayedColumns.length;

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

  public ngAfterViewInit(): void {

    this.logger.info('Collection Component: ngAfterViewInit()');

    this.subscribe();

    // A layout breakpoint is viewport size threshold at which a layout shift can occur.
    // The viewport size ranges between breakpoints correspond to different standard screen sizes.
    // See: https://material.angular.dev/cdk/layout/overview

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {

      if (result.matches) {
        this.displayedColumns = this.mobileDeviceColumns;
      } else {
        this.displayedColumns = this.desktopDeviceColumns;
      }

      if (this.footerColSpan != this.displayedColumns.length) {
        this.footerColSpan = this.displayedColumns.length;
        this.detectChanges();
      }

      this.logger.info('footerColSpan: ' + this.footerColSpan);

    });

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

    // this.logger.info('Collection Component: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public refresh(): void {

    this.logger.info('CollectionComponent: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public ngOnDestroy(): void {

    this.destroyed.next();
    this.destroyed.complete();

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
