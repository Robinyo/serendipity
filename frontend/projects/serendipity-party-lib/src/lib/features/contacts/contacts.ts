import { inject, input, effect, Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

// import { ActivityBar, CommandBar, Collection, CollectionFooter } from 'serendipity-components-lib';
import { ActivityBar, CommandBar } from 'serendipity-components-lib';

import { PartyService } from '../../services/party/PartyService';

import { ContactModel } from '../../models/contact';

import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './column-defs';

// import { CONTACT_WIZARD } from  './constants';

// TODO
import { AbstractCollection } from './collection/collection';
import { CollectionFooter } from './collection/footer';

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

    this.logger.info('Contacts Component');

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





/*

import { inject, input, effect, Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { ActivityBar, CommandBar, Collection, CollectionFooter } from 'serendipity-components-lib';

import { ContactsService } from '../../services/contacts/contacts';

import { ContactModel } from '../../models/contact';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contacts.scss'
})
export class Contacts extends Collection<ContactModel> {

  public metadata = input<any>();

  private entityService: ContactsService = inject(ContactsService);

  constructor() {

    super({
      columnDefsFilename: "",
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE,
      limit: 10
    });

    this.logger.info('Contacts Component');

    effect(() => {
      const resolvedData = this.metadata();
      if (resolvedData) {
        this.columnDefs = resolvedData;
        this.logger.info('columnDefs updated via modern functional router effect');
      }
    });

  }

  protected subscribe() {

    this.logger.info('Contacts Component: subscribe()');

    this.isLoading = true;

    const subscription: Subscription = this.entityService.find(this.filter, this.offset, this.limit).subscribe(

      (response: any) => {

        this.logger.info('Contacts Component: subscribe() success handler');

        // this.logger.info('response: ' + JSON.stringify(response, null, 2));

        this.count = response.body.page.totalElements;

        this.logger.info('count: ' + this.count + ' Contacts');

        if (this.count > 0) {
          this.items = response.body._embedded.individuals;
        } else {
          this.items = [];
        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

        this.isLoading = false;

        this.detectChanges();

      }

    );

    this.subscriptions.push(subscription);

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
