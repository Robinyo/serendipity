import { inject, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';

import { ActivityBar, CommandBar, Collection } from 'serendipity-components-lib';

import { ContactAdapter } from '../../adapters/contact.adapter';
import { ContactsService } from '../../services/contacts/contacts';

import { Contact } from '../../models/contact';

import { COLUMN_DEFS } from './column-defs';
import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './constants';

@Component({
  selector: 'lib-contacts',
  imports: [
    ActivityBar,
    CommandBar,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './contacts.html',
  standalone: true,
  styleUrl: './contacts.scss'
})
export class Contacts extends Collection<Contact> {

  private entityAdapter: ContactAdapter = inject(ContactAdapter);
  private entityService: ContactsService = inject(ContactsService);

  constructor() {

    super({
      columnDefsFilename: COLUMN_DEFS,
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE,
      limit: 10
    });

    this.logger.info('Contacts');

  }

  protected subscribe() {}

  /*

  protected subscribe() {

    this.logger.info('Contacts Component: subscribe()');

    this.subscription = this.entityService.find(this.filter, this.offset, this.limit).subscribe(

      (response: any) => {

        this.logger.info('Contacts Component: subscribe() success handler');

        this.count = response.body.page.totalElements;

        this.logger.info('count: ' + this.count);

        if (this.count > 0) {

          this.items = response.body._embedded.individualModels.map(
            ((item: any) => this.entityAdapter.adapt(item)));

        } else {

          this.items = [];
          this.items.push(new Contact());

        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      }

    );

  }

  */

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
