import { inject, effect, Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { ActivityBar, CommandBar, AbstractCollection, CollectionFooter } from 'serendipity-components-lib';

import { AccountsService } from '../../services/accounts/accounts';

import { AccountModel } from '../../models/models';

import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './column-defs';

@Component({
  selector: 'accounts',
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
  templateUrl: './accounts.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './accounts.scss'
})
export class Accounts extends AbstractCollection<AccountModel> {

  constructor() {

    super({
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE},
      inject(AccountsService), 'organisations');

    this.logger.info('Accounts Component: constructor()');

    effect(() => {

      const resolvedData = this.metadata();

      if (resolvedData?.columnDefs && resolvedData?.accounts) {
        this.columnDefs = resolvedData.columnDefs;
        const envelop = resolvedData.accounts;

        // Save data directly into the newly abstracted base cache tracker
        this.allCachedItems = envelop._embedded?.organisations || [];
        this.count = envelop.page.totalElements;

        this.logger.info('count: ' + this.count + ' Accounts');

        // Map data source framework natively
        // Explicitly declare the type parameters inside the constructor diamond operator
        this.dataSource = new MatTableDataSource<AccountModel | { isPlaceholder: boolean }>([]);

        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

        // Execute the base class cache renderer instantly
        this.renderCurrentPage();
      }

    });

  }

  /*

  protected refresh() {

    this.logger.info(`Refreshing Accounts Cache Dataset for Filter: ${this.filter}`);

    queueMicrotask(() => this.isLoading.set(true));

    // Convert your current UI row offset into a valid Spring API Page Index.
    // For example: Row Index 100 divided by Limit 100 = API Page 1.
    const currentUiRowIndex = this.offset * this.rowsPerPage;
    const springApiPageIndex = Math.floor(currentUiRowIndex / this.limit);

    this.logger.info(`Requesting Server Data -> API Page: ${springApiPageIndex}, Size Size Chunk: ${this.limit}`);

    // Pass the zero-based API Page index directly into your Spring proxy call
    this.accountsService.find(this.filter, springApiPageIndex, this.limit)
      .subscribe({
        next: (response: any) => {

          this.logger.info('Accounts Component: Network Cache Refreshed successfully');

          const newItems = response._embedded?.organisations || [];

          // If a user clicks an A-Z letter filter, we WANT to overwrite the cache from scratch.
          // But if they are just scrolling/paginating forward, we APPEND the data.
          if (this.offset === 0) {
            this.allCachedItems = newItems;
          } else {
            this.allCachedItems = [...this.allCachedItems, ...newItems];
          }

          this.count = response.page.totalElements;
          this.logger.info(`Cache size expanded to: ${this.allCachedItems.length} records total.`);

          // Render the current page slice out of the accumulated cache matrix
          this.renderCurrentPage();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Accounts refresh fault intercept', err);
          this.isLoading.set(false);
        }
      });

  }

  */

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('Accounts Component: onNew()');

    // this.router.navigate([ACCOUNT_WIZARD]);
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
