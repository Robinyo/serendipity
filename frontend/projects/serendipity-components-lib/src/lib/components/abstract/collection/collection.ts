import { Directive, inject, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AbstractComponent } from '../component/component';
import { ColumnDef } from '../../../models/models';

import { ALL, ALPHABET, DEFAULT_FOOTER_COL_SPAN } from './constants';

export interface CollectionComponentConfig {

  // Mandatory items
  desktopDeviceColumns: string[];
  mobileDeviceColumns: string[];

  // Optional items
  filter?: string;
  offset?: number;
  limit?: number;

}

@Directive()
export abstract class AbstractCollection<T> extends AbstractComponent {

  @ViewChild(MatSort, {static: false})
  public sort: MatSort | undefined;

  public items!: Array<T>;
  public selectedItem!: T;

  // public alphabet = ALPHABET;
  // @ts-ignore
  public columnDefs: ColumnDef[];
  // @ts-ignore
  public dataSource: MatTableDataSource<T>;
  public displayedColumns: string[];
  public footerAllLabel = ALL;
  public footerColSpan = DEFAULT_FOOTER_COL_SPAN;
  public pageNumber = 1;
  public selectedFooterItemId = ALL;

  protected count = 0;

  protected snackBar: MatSnackBar = inject(MatSnackBar);
  // protected sidenavService: SidenavService;

  protected filter = '';
  protected offset = 0;
  protected limit = 100;

  protected desktopDeviceColumns: string[];
  protected mobileDeviceColumns: string[];

  protected constructor(config: CollectionComponentConfig) {

    super();

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

  //
  // Pagination events
  //

  public onClickFilterButton(character: string): void {

    this.logger.info('Collection Component: onClickFilterButton()');

    this.logger.info(`Filter selected: ${character}`);

    // 1. Immediately update local state criteria synchronously
    this.selectedFooterItemId = character;
    this.offset = 0; // Reset page bounds on filter changes
    this.pageNumber = 1;

    this.filter = character === this.footerAllLabel ? '' : character;

    // 2. Dispatch to execution microtask window
    this.refresh();
  }

  public onClickNextPageButton(): void {

    this.logger.info('Collection Component: onClickNextPageButton()');

    this.offset++;
    this.pageNumber++;

    this.refresh();
  }

  public onClickPreviousPageButton(): void {

    this.logger.info('Collection Component: onClickPreviousPageButton()');

    // Safe mathematical boundary clamps using standard subtraction
    this.offset = Math.max(0, this.offset - 1);
    this.pageNumber = Math.max(1, this.pageNumber - 1);

    this.refresh();
  }

  public onClickFirstPageButton(): void {

    this.logger.info('Collection Component: onClickFirstPageButton()');

    this.offset = 0;
    this.pageNumber = 1;

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

  protected abstract refresh(): void;

}
