import { AfterViewInit, ChangeDetectorRef, Directive, inject, isDevMode, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'serendipity-auth-lib';
import { ConfigService, LoggerService } from 'serendipity-utils-lib';
import { DialogService } from '../../../services/dialogs/dialog';
// import { SidenavService } from '../../../services/sidenav/sidenav.service';

import { ColumnDef } from '../../../models/column';

import { ALL, ALPHABET, DEFAULT_FOOTER_COL_SPAN } from './constants';

import { AbstractComponent } from '../component/component';

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
export abstract class Collection<T> extends AbstractComponent {

  @ViewChild(MatSort, {static: false})
  public sort: MatSort | undefined;

  public items!: Array<T>;
  public selectedItem!: T;

  public alphabet = ALPHABET;
  // @ts-ignore
  public columnDefs: ColumnDef[];
  // @ts-ignore
  public dataSource: MatTableDataSource<T>;
  public displayedColumns: string[];
  public footerAllLabel = ALL;
  public footerColSpan = DEFAULT_FOOTER_COL_SPAN;
  public pageNumber = 1;
  public selectedFooterItemId = ALL;

  protected authService: AuthService = inject(AuthService);
  protected count = 0;
  protected configService = inject(ConfigService);
  protected dialogService: DialogService = inject(DialogService);
  protected router = inject(Router);
  protected snackBar: MatSnackBar = inject(MatSnackBar);
  // protected sidenavService: SidenavService;

  protected filter = '';
  protected limit = 100;
  protected offset = 0;

  protected columnDefsFilename: string;
  protected desktopDeviceColumns: string[];
  protected mobileDeviceColumns: string[];

  protected constructor(config: CollectionComponentConfig) {

    super();

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

  override ngAfterViewInit(): void {

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
          // this.detectChanges();
        }

        this.handsetPortrait = result.matches;
        this.detectChanges();

        this.logger.info('footerColSpan: ' + this.footerColSpan);

    });

  }

  //
  // Pagination events
  //

  public onClickFilterButton(id: string): void {

    this.logger.info('Collection Component: onClickFilterButton()');

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

    this.logger.info('Collection Component: onClickFirstPageButton()');

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

    this.logger.info('Collection Component: onClickPreviousPageButton()');

    // this.offset = this.offset - this.limit;
    this.offset--;

    if (this.offset < 0) {
      this.offset = 0;
    }

    this.pageNumber--;

    this.refresh();
  }

  public canClickNextPageButton(): boolean {

    // this.logger.info('Collection Component: canClickNextPageButton()');

    if (this.count === 0) {
      return false;
    }

    const pages = Math.ceil(this.count / this.limit);

    // this.logger.info('pages: ' + pages);
    // this.logger.info('this.pageNumber: ' + this.pageNumber);

    return (pages - this.pageNumber) > 0;
  }

  public onClickNextPageButton(): void {

    this.logger.info('Collection Component: onClickNextPageButton()');

    // this.offset = this.offset + this.limit;
    this.offset++;

    this.pageNumber++;

    this.refresh();
  }

  //
  // Command Bar events
  //

  public onToggleSidenav(): void {

    this.logger.info('Collection Component: onToggleSidenav()');

    // this.sidenavService.toggle();
  }

  //
  // Misc
  //

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

        this.logger.error('Collection Component getFormattedCellValue() - invalid column type');
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
