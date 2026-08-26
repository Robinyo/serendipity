import { inject, input, effect, Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { ActivityBar, CommandBar, Collection, CollectionFooter } from 'serendipity-components-lib';

import { ContactAdapter } from '../../adapters/contact';
import { ContactsService } from '../../services/contacts/contacts';

import { ContactModel } from '../../models/contact';

import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './column-defs';

import { CONTACT_WIZARD } from  './constants';

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

  private entityAdapter: ContactAdapter = inject(ContactAdapter);
  private entityService: ContactsService = inject(ContactsService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {

    super({
      // columnDefsFilename: COLUMN_DEFS,
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

    // this.columnDefs = this.route.snapshot.data['columnDefs'];

    // this.logger.info('columnDefs: ' + JSON.stringify(this.columnDefs, null, 2));

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
