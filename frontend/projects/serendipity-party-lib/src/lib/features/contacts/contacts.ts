import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';

import { ActivityBar, CommandBar, Collection } from 'serendipity-components-lib';

import { Contact } from '../../models/contact';

import { CONTACT_WIZARD, CONTACTS } from '../../models/constants';
import { CONTACTS_COLUMN_DEFS } from '../../models/column-defs';
import { CONTACTS_COLUMNS_DESKTOP, CONTACTS_COLUMNS_MOBILE } from '../../models/constants';

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

  constructor() {

    super({
      columnDefsFilename: CONTACTS_COLUMN_DEFS,
      desktopDeviceColumns: CONTACTS_COLUMNS_DESKTOP,
      mobileDeviceColumns: CONTACTS_COLUMNS_MOBILE,
      limit: 10
    });

  }

  protected subscribe() {

    this.logger.info('Contacts Component: subscribe()');

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
