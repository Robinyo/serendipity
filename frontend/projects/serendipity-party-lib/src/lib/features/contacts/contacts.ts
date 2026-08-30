import { inject, effect, Component, ChangeDetectionStrategy, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { ActivityBar, CommandBar, AbstractCollection, CollectionFooter } from 'serendipity-components-lib';

import { PartyService } from '../../services/party/party';

import { ContactModel } from '../../models/models';

import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './column-defs';

// import { CONTACT_WIZARD } from  './constants';

@Component({
  selector: 'contacts',
  imports: [
    ActivityBar,
    CommandBar,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    CollectionFooter,
    RouterLink
  ],
  templateUrl: './contacts.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contacts.scss'
})
export class Contacts extends AbstractCollection<ContactModel> {

  // IntelliJ uses an internal incremental file parser to keep its type checking lightning fast. When you refactor a
  // codebase by copying and pasting fields or methods upward into a generic base class (AbstractCollection<T>), the
  // background service fails to bubble the changes down to subclasses that inherit the generic type T.
  // Using the declare keyword is the cleanest way to clear these false-positive red lines until you eventually close
  // the project and manually wipe out the workspace caches.

  public declare metadata: InputSignal<any>;
  protected declare padItems: (rawItems: any[]) => any[];

  private partyService = inject(PartyService);

  constructor() {
    super({
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE
    });

    this.logger.info('Contacts Component: constructor()');

    effect(() => {
      const resolvedData = this.metadata();

      if (resolvedData?.columnDefs && resolvedData?.partySummary) {
        this.columnDefs = resolvedData.columnDefs;
        const envelop = resolvedData.partySummary;

        // Save data directly into the newly abstracted base cache tracker
        this.allCachedItems = envelop.body._embedded?.individuals || [];
        this.count = envelop.body.page.totalElements;

        this.logger.info('count: ' + this.count + ' Contacts');

        // Map data source framework natively
        // Explicitly declare the type parameters inside the constructor diamond operator
        this.dataSource = new MatTableDataSource<ContactModel | { isPlaceholder: boolean }>([]);

        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

        // Execute the base class cache renderer instantly
        this.renderCurrentPage();
      }
    });
  }

  protected refresh() {
    this.logger.info(`Refreshing Contacts Cache Dataset for Filter: ${this.filter}`);

    queueMicrotask(() => this.isLoading.set(true));

    // 🧮 1. Convert your current UI row offset into a valid Spring API Page Index.
    // For example: Row Index 100 divided by Limit 100 = API Page 1.
    const currentUiRowIndex = this.offset * this.rowsPerPage;
    const springApiPageIndex = Math.floor(currentUiRowIndex / this.limit);

    this.logger.info(`Requesting Server Data -> API Page: ${springApiPageIndex}, Size Size Chunk: ${this.limit}`);

    // 📡 2. Pass the zero-based API Page index directly into your Spring proxy call
    this.partyService.findAllContacts(this.filter, springApiPageIndex, this.limit)
      .subscribe({
        next: (response: any) => {
          this.logger.info('Contacts Component: Network Cache Refreshed successfully');

          const newItems = response.body._embedded?.individuals || [];

          // 🛑 3. SAFELY APPEND OR OVERWRITE BASED ON CONTEXT
          // If a user clicks an A-Z letter filter, we WANT to overwrite the cache from scratch.
          // But if they are just scrolling/paginating forward, we APPEND the data.
          if (this.offset === 0) {
            this.allCachedItems = newItems;
          } else {
            this.allCachedItems = [...this.allCachedItems, ...newItems];
          }

          this.count = response.body.page.totalElements;
          this.logger.info(`Cache size expanded to: ${this.allCachedItems.length} records total.`);

          // Render the current page slice out of the accumulated cache matrix
          this.renderCurrentPage();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Contacts refresh fault intercept', err);
          this.isLoading.set(false);
        }
      });
  }

  /*

  protected refresh() {
    this.logger.info(`Refreshing Contacts Cache Dataset for Filter: ${this.filter}`);

    queueMicrotask(() => this.isLoading.set(true));

    // ⚡ UPDATE THIS LINE: Calculate the starting record index based on active page states
    const startingRecordIndex = this.offset * this.rowsPerPage;

    // Pass the dynamic index pointer instead of hardcoded 0
    this.partyService.findAllContacts(this.filter, startingRecordIndex, this.limit)
      .subscribe({
        next: (response: any) => {
          this.logger.info('Contacts Component: Network Cache Refreshed successfully');

          // Overwrite/Append the memory cache array block
          this.allCachedItems = response.body._embedded?.individuals || [];
          this.count = response.body.page.totalElements;

          // Tell the base class to render the current page slice cleanly
          this.renderCurrentPage();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Contacts refresh fault intercept', err);
          this.isLoading.set(false);
        }
      });
  }

  protected refresh() {
    this.logger.info(`Refreshing Contacts Cache Dataset for Filter: ${this.filter}`);

    queueMicrotask(() => this.isLoading.set(true));

    this.partyService.findAllContacts(this.filter, 0, this.limit)
      .subscribe({
        next: (response: any) => {
          this.logger.info('Contacts Component: Network Cache Refreshed successfully');

          // Overwrite the base memory cache array block
          this.allCachedItems = response.body._embedded?.individuals || [];
          this.count = response.body.page.totalElements;

          this.logger.info('count: ' + this.count + ' Contacts');

          // Tell the base class to render the new page 1 slice natively
          this.renderCurrentPage();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Contacts refresh fault intercept', err);
          this.isLoading.set(false);
        }
      });
  }


  constructor() {
    super({
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE,
      limit: 100,       // Large cache fetch sizing
      rowsPerPage: 10   // Screen visibility row clamp sizing
    });

    this.logger.info('Contacts Component: constructor()');

    effect(() => {

      const resolvedData = this.metadata();

      if (resolvedData?.columnDefs && resolvedData?.partySummary) {

        this.columnDefs = resolvedData.columnDefs;
        const envelop = resolvedData.partySummary;
        this.count = envelop.body.page.totalElements;

        this.logger.info('count: ' + this.count + ' Contacts');

        // Extract raw array items from Spring HATEOAS payload structural layers safely
        const rawItems = envelop.body._embedded?.individuals || [];

        this.items = this.padItems(rawItems);

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;
      }
    });
  }

  protected refresh() {
    this.logger.info('Contacts Component: refresh()');
    this.logger.info(`Refreshing Contacts with filter: ${this.filter}, offset: ${this.offset} limit: ${this.limit}`);

    queueMicrotask(() => {
      this.isLoading.set(true);
    });

    this.partyService.findAllContacts(this.filter, this.offset, this.limit)
      .subscribe({
        next: (response: any) => {

          this.logger.info('Contacts Component: refresh() success handler');

          this.count = response.body.page.totalElements;

          this.logger.info('count: ' + this.count + ' Contacts');

          const rawItems = response.body._embedded?.individuals || [];

          this.items = this.padItems(rawItems);

          if (!this.dataSource) {
            this.dataSource = new MatTableDataSource(this.items);
            this.dataSource.sortingDataAccessor = pathDataAccessor;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource.data = this.items;
          }

          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Contacts refresh fault intercept', err);
          this.isLoading.set(false);
        }
      });
  }

  */

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('Contacts Component: onNew()');

    // this.router.navigate([CONTACT_WIZARD]);
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
    .reduce((accumulator: any, key: string) => {
      return accumulator ? accumulator[key] : undefined;
    }, item);
}

// https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
// this.items.length = 0;



/*

import { inject, input, effect, Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { ActivityBar, CommandBar, AbstractCollection, CollectionFooter } from 'serendipity-components-lib';

import { PartyService } from '../../services/party/party';

import { ContactModel } from '../../models/models';

import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './column-defs';

// import { CONTACT_WIZARD } from  './constants';

@Component({
  selector: 'contacts',
  imports: [
    ActivityBar,
    CommandBar,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    CollectionFooter,
    RouterLink
  ],
  templateUrl: './contacts.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contacts.scss'
})
export class Contacts extends AbstractCollection<ContactModel> {

  public metadata = input<any>();

  private partyService = inject(PartyService);

  constructor() {

    super({
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE,
      limit: 10
    });

    this.logger.info('Contacts Component: constructor()');

    effect(() => {

      const resolvedData = this.metadata();

      if (resolvedData?.columnDefs && resolvedData?.partySummary) {

        this.columnDefs = resolvedData.columnDefs;

        const envelop = resolvedData.partySummary;

        this.count = envelop.body.page.totalElements;

        this.logger.info('count: ' + this.count + ' Contacts');

        if (this.count > 0) {
          this.items = envelop.body._embedded.individuals;
        } else {
          this.items = [];
        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      }

    });

  }

  protected refresh() {

    this.logger.info('Contacts Component: refresh()');

    this.logger.info(`Refreshing Contacts with filter: ${this.filter}, offset: ${this.offset} limit: ${this.limit}`);

    // Defer visibility state adjustments out of the current compilation check
    queueMicrotask(() => {
      this.isLoading.set(true);
    });

    this.partyService.findAllContacts(this.filter, this.offset, this.limit)
      .subscribe({
        next: (response: any) => {

          this.logger.info('Contacts Component: refresh() success handler');

          this.count = response.body.page.totalElements;

          this.logger.info('count: ' + this.count + ' Contacts');

          if (this.count > 0) {
            this.items = response.body._embedded.individuals;
          } else {
            this.items = [];
          }

          if (!this.dataSource) {
            this.dataSource = new MatTableDataSource(this.items);
            this.dataSource.sortingDataAccessor = pathDataAccessor;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource.data = this.items;
          }

          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Contacts refresh fault intercept', err);
          this.isLoading.set(false);
        }
      });
  }

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('Contacts Component: onNew()');

    // this.router.navigate([CONTACT_WIZARD]);
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
    .reduce((accumulator: any, key: string) => {
      return accumulator ? accumulator[key] : undefined;
    }, item);
}

// https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
// this.items.length = 0;

*/

