import { computed, DestroyRef, Directive, inject, input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, debounceTime, takeUntil } from 'rxjs';

import { AbstractComponent } from '../component/component';
import { ColumnDef } from '../../../models/models';
import { ALL } from './constants';

export interface CollectionComponentConfig {
  desktopDeviceColumns: string[];
  mobileDeviceColumns: string[];
  filter?: string;
  offset?: number;
  limit?: number;
  rowsPerPage?: number;
}

const DEFAULT_LIMIT: number = 100; // Optimal bulk network chunk default size
const DEFAULT_ROWS_PER_PAGE: number = 10;

// $navigation-bar-height-desktop + $command-bar-height-desktop
const DEFAULT_HEADER_OFFSET: number = 64 + 50;

@Directive()
export abstract class AbstractCollection<T> extends AbstractComponent implements OnInit {

  public metadata = input<any>();

  @ViewChild(MatSort, { static: false })
  public sort: MatSort | undefined;

  public items!: Array<T | { isPlaceholder: boolean }>;
  public selectedItem!: T;

  public columnDefs!: ColumnDef[];
  public dataSource!: MatTableDataSource<T | { isPlaceholder: boolean }>;

  public pageNumber: number = 1;
  public rowsPerPage: number = DEFAULT_ROWS_PER_PAGE;

  public footerAllLabel: string = ALL;
  public selectedFooterItemId: string = ALL;

  public displayedColumns = computed<string[]>(() => {
    return this.isHandsetPortrait()
      ? this.mobileDeviceColumns
      : this.desktopDeviceColumns;
  });

  // Automatically calculate your footer column span based directly on your active column count.
  public footerColSpan = computed<number>(() => {
    const span = this.displayedColumns().length;
    this.logger.info(`Computed footerColSpan: ${span}`);
    return span;
  });

  protected destroyRef: DestroyRef = inject(DestroyRef);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  protected filter = '';
  protected offset = 0;       // Serving as client-side UI page index calculation
  protected limit = DEFAULT_LIMIT;
  protected count = 0;

  protected desktopDeviceColumns: string[];
  protected mobileDeviceColumns: string[];

  // Core Centralised Cache Storage Array for Local Slicing Pagination
  protected allCachedItems: T[] = [];

  private MINIMUM_ROWS = 10;        // The absolute lower boundary clamp
  private APPROX_ROW_HEIGHT = 48;   // Standard Angular Material Table Row height in pixels

  protected constructor(config: CollectionComponentConfig) {
    super();

    this.desktopDeviceColumns = config.desktopDeviceColumns;
    this.mobileDeviceColumns = config.mobileDeviceColumns;

    if (config.filter !== undefined) this.filter = config.filter;
    if (config.limit !== undefined) this.limit = config.limit;
    if (config.offset !== undefined) this.offset = config.offset;
    if (config.rowsPerPage !== undefined) this.rowsPerPage = config.rowsPerPage;
  }

  public ngOnInit(): void {
    this.logger.info('Base Collection: ngOnInit() initialization tracking');

    // Calculate the initial layout size right on startup boot
    this.calculateDynamicRowsPerPage();

    // Listen to browser window adjustments.
    // We add a 150ms debounce buffer so we don't hammer calculations while dragging.
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(150),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.calculateDynamicRowsPerPage();
      });
  }

  // Concrete components implement this to fetch data from their specific microservices.
  // Only called when a structural data scope switch is requested (like an A-Z alpha filter click).
  protected abstract refresh(): void;

  // Slices the active memory cache based on current page configurations,
  // automatically pads missing slots, and safely streams it to the Material table.
  protected renderCurrentPage(): void {
    this.logger.info(`Base Collection: Slicing UI Page ${this.pageNumber} (Offset Index: ${this.offset})`);

    const startIndex = this.offset * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    // Slice the small display block out of your cached 100-item block
    const pageItemsSubset = this.allCachedItems.slice(startIndex, endIndex);

    // Apply the padding rules
    this.items = this.padItems(pageItemsSubset);

    if (this.dataSource) {
      this.dataSource.data = this.items;
    }
  }

  // Inspects the browser viewport bounding heights, subtracts top action bars,
  // and scales the placeholder padding sizes to match screen space completely.
  private calculateDynamicRowsPerPage(): void {
    try {
      // Find the scrollable table container box in the DOM tree view
      const tableContainer = document.querySelector('.md-table-container');

      if (!tableContainer) {
        // Fallback baseline if the element isn't painted yet
        this.rowsPerPage = this.MINIMUM_ROWS;
        return;
      }

      // Read how far down the page the table container starts,
      // and calculate how much room is left until the bottom viewport edge.
      const boundingBox = tableContainer.getBoundingClientRect();
      const overheadOffset = boundingBox.top;
      const footerPaddingOffset = 58 + DEFAULT_HEADER_OFFSET; // Reserve space for the A-Z footer

      const availableVerticalPixels = window.innerHeight - overheadOffset - footerPaddingOffset;

      // Calculate how many rows fit inside the remaining pixel pool
      const calculatedRowsCount = Math.floor(availableVerticalPixels / this.APPROX_ROW_HEIGHT);

      // ⚡ THE SYSTEM CLAMP: Force the layout to never drop below 10 rows
      const targetRowsCount = Math.max(this.MINIMUM_ROWS, calculatedRowsCount);

      if (this.rowsPerPage !== targetRowsCount) {
        this.logger.info(`Layout scaling updated: ${this.rowsPerPage} -> ${targetRowsCount} rows`);
        this.rowsPerPage = targetRowsCount;

        // If data is already sitting in our cache, refresh the active screen slice matrix instantly!
        if (this.allCachedItems && this.allCachedItems.length > 0) {
          this.renderCurrentPage();
        }
      }
    } catch (error) {
      this.logger.error('Failed to calculate dynamic view bounds height adjustments', error);
      this.rowsPerPage = this.MINIMUM_ROWS; // Fail-safe default backup
    }
  }

  // Generates matching placeholder row entities to keep table heights locked.
  protected padItems(pageItems: any[]): any[] {
    const totalFetched = pageItems.length;

    if (totalFetched > 0 && totalFetched < this.rowsPerPage) {
      const fillerCount = this.rowsPerPage - totalFetched;
      const fillerRows = Array.from({ length: fillerCount }, () => ({ isPlaceholder: true }));
      return [...pageItems, ...fillerRows];
    } else if (totalFetched === 0) {
      return Array.from({ length: this.rowsPerPage }, () => ({ isPlaceholder: true }));
    }

    return pageItems;
  }

  //
  // Centralised Navigation Events (Now completely decoupled and running out of local cache!)
  //

  public onClickFilterButton(character: string): void {
    this.logger.info(`Collection Component: Filter selected: ${character}`);

    this.selectedFooterItemId = character;
    this.offset = 0;
    this.pageNumber = 1;
    this.filter = character === this.footerAllLabel ? '' : character;

    // Filter changes change data scopes: request fresh payload chunk from database microservice
    this.refresh();
  }

  public onClickNextPageButton(): void {

    this.logger.info('Collection Component: onClickNextPageButton()');

    // Calculate the starting array index position for the upcoming page
    const nextStartIndex = (this.offset + 1) * this.rowsPerPage;

    // If the next page requires records beyond what is currently cached,
    // and we haven't hit the absolute backend total yet, go fetch the next network chunk!
    if (nextStartIndex >= this.allCachedItems.length && this.allCachedItems.length < this.count) {

      this.logger.info('Cache limit reached. Requesting next data block from server microservice...');

      // Advance coordinates
      this.offset++;
      this.pageNumber++;

      // Update your concrete refresh method to pass the new offset chunk
      this.refresh();
    } else {
      // Data is already cached locally, slice it out of memory instantly
      this.offset++;
      this.pageNumber++;
      this.renderCurrentPage();
    }
  }


  public onClickPreviousPageButton(): void {
    this.logger.info('Collection Component: onClickPreviousPageButton()');
    this.offset = Math.max(0, this.offset - 1);
    this.pageNumber = Math.max(1, this.pageNumber - 1);
    this.renderCurrentPage();
  }

  public onClickFirstPageButton(): void {
    this.logger.info('Collection Component: onClickFirstPageButton()');
    this.offset = 0;
    this.pageNumber = 1;
    this.renderCurrentPage();
  }

  public onToggleSidenav(): void {
    this.logger.info('Collection Component: onToggleSidenav()');
  }

  public getFormattedCellValue(row: any, column: any) {
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

    return value;
  }

  public getProperty = (obj: any, path: any) => (
    path.split('.').reduce((o: any, p: any) => o && o[p], obj)
  )
}

/*

import { computed, Directive, inject, input, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AbstractComponent } from '../component/component';
import { ColumnDef } from '../../../models/models';
import { ALL } from './constants';

export interface CollectionComponentConfig {
  desktopDeviceColumns: string[];
  mobileDeviceColumns: string[];
  filter?: string;
  offset?: number;
  limit?: number;
  rowsPerPage?: number;
}

const DEFAULT_LIMIT = 100; // Optimal bulk network chunk default size
const DEFAULT_ROWS_PER_PAGE = 10;

@Directive()
export abstract class AbstractCollection<T> extends AbstractComponent {

  public metadata = input<any>();

  @ViewChild(MatSort, { static: false })
  public sort: MatSort | undefined;

  public items!: Array<T | { isPlaceholder: boolean }>;
  public selectedItem!: T;

  public columnDefs!: ColumnDef[];
  public dataSource!: MatTableDataSource<T | { isPlaceholder: boolean }>;

  public pageNumber: number = 1;
  public rowsPerPage: number = DEFAULT_ROWS_PER_PAGE;

  public footerAllLabel: string = ALL;
  public selectedFooterItemId: string = ALL;

  public displayedColumns = computed<string[]>(() => {
    return this.isHandsetPortrait()
      ? this.mobileDeviceColumns
      : this.desktopDeviceColumns;
  });

  // Automatically calculate your footer column span based directly on your active column count.
  public footerColSpan = computed<number>(() => {
    const span = this.displayedColumns().length;
    this.logger.info(`Computed footerColSpan: ${span}`);
    return span;
  });

  protected snackBar: MatSnackBar = inject(MatSnackBar);

  protected filter = '';
  protected offset = 0;       // Serving as client-side UI page index calculation
  protected limit = DEFAULT_LIMIT;
  protected count = 0;

  protected desktopDeviceColumns: string[];
  protected mobileDeviceColumns: string[];

  // Core Centralised Cache Storage Array for Local Slicing Pagination
  protected allCachedItems: T[] = [];

  protected constructor(config: CollectionComponentConfig) {
    super();

    this.desktopDeviceColumns = config.desktopDeviceColumns;
    this.mobileDeviceColumns = config.mobileDeviceColumns;

    if (config.filter !== undefined) this.filter = config.filter;
    if (config.limit !== undefined) this.limit = config.limit;
    if (config.offset !== undefined) this.offset = config.offset;
    if (config.rowsPerPage !== undefined) this.rowsPerPage = config.rowsPerPage;
  }

  // Concrete components implement this to fetch data from their specific microservices.
  // Only called when a structural data scope switch is requested (like an A-Z alpha filter click).
  protected abstract refresh(): void;

  // Slices the active memory cache based on current page configurations,
  // automatically pads missing slots, and safely streams it to the Material table.
  protected renderCurrentPage(): void {
    this.logger.info(`Base Collection: Slicing UI Page ${this.pageNumber} (Offset Index: ${this.offset})`);

    const startIndex = this.offset * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    // Slice the small display block out of your cached 100-item block
    const pageItemsSubset = this.allCachedItems.slice(startIndex, endIndex);

    // Apply the padding rules
    this.items = this.padItems(pageItemsSubset);

    if (this.dataSource) {
      this.dataSource.data = this.items;
    }
  }

  // Generates matching placeholder row entities to keep table heights locked.
  protected padItems(pageItems: any[]): any[] {
    const totalFetched = pageItems.length;

    if (totalFetched > 0 && totalFetched < this.rowsPerPage) {
      const fillerCount = this.rowsPerPage - totalFetched;
      const fillerRows = Array.from({ length: fillerCount }, () => ({ isPlaceholder: true }));
      return [...pageItems, ...fillerRows];
    } else if (totalFetched === 0) {
      return Array.from({ length: this.rowsPerPage }, () => ({ isPlaceholder: true }));
    }

    return pageItems;
  }

  //
  // Centralised Navigation Events (Now completely decoupled and running out of local cache!)
  //

  public onClickFilterButton(character: string): void {
    this.logger.info(`Collection Component: Filter selected: ${character}`);

    this.selectedFooterItemId = character;
    this.offset = 0;
    this.pageNumber = 1;
    this.filter = character === this.footerAllLabel ? '' : character;

    // Filter changes change data scopes: request fresh payload chunk from database microservice
    this.refresh();
  }

  public onClickNextPageButton(): void {
    this.logger.info('Collection Component: onClickNextPageButton()');
    this.offset++;
    this.pageNumber++;
    this.renderCurrentPage();
  }

  public onClickPreviousPageButton(): void {
    this.logger.info('Collection Component: onClickPreviousPageButton()');
    this.offset = Math.max(0, this.offset - 1);
    this.pageNumber = Math.max(1, this.pageNumber - 1);
    this.renderCurrentPage();
  }

  public onClickFirstPageButton(): void {
    this.logger.info('Collection Component: onClickFirstPageButton()');
    this.offset = 0;
    this.pageNumber = 1;
    this.renderCurrentPage();
  }

  public onToggleSidenav(): void {
    this.logger.info('Collection Component: onToggleSidenav()');
  }

  public getFormattedCellValue(row: any, column: any) {
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

    return value;
  }

  public getProperty = (obj: any, path: any) => (
    path.split('.').reduce((o: any, p: any) => o && o[p], obj)
  )
}

*/
