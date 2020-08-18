import { Component } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { CollectionComponent } from 'serendipity-components';

import { ContactAdapter } from '../../adapters/contact.adapter';
import { ContactsService } from '../../services/contacts/contacts.service';

import { Contact } from '../../models/contact';
import { CONTACTS_COLUMN_DEFS } from '../../models/column-defs';

import {
  CONTACTS_COLUMNS_DESKTOP,
  CONTACTS_COLUMNS_MOBILE
} from '../../models/constants';

@Component({
  selector: 'sales-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent extends CollectionComponent<Contact> {

  constructor(private entityAdapter: ContactAdapter,
              private entityService: ContactsService) {

    super({
      columnDefsFilename: CONTACTS_COLUMN_DEFS,
      desktopDeviceColumns: CONTACTS_COLUMNS_DESKTOP,
      mobileDeviceColumns: CONTACTS_COLUMNS_MOBILE,
      limit: 10
    });

  }

  protected subscribe() {

    this.logger.info('ContactsComponent: subscribe()');

    this.subscription = this.entityService.find(this.filter, this.offset, this.limit).subscribe(

      (response: any) => {

        this.logger.info('ContactsComponent: subscribe() success handler');

        this.count = response.body.page.totalElements;

        this.logger.info('count: ' + this.count);

        if (this.count > 0) {

          this.items = response.body._embedded.individualModels.map(
            (item => this.entityAdapter.adapt(item)));

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

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('ContactsComponent: onNew()');

    this.router.navigate(['customers/contacts/new']);
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
  .reduce((accumulator: any, key: string) => {
    return accumulator ? accumulator[key] : undefined;
  }, item);
}

/*

  protected subscribe() {

    this.logger.info('ContactsComponent: subscribe()');

    this.subscription = this.entityService.find(this.filter, this.offset, this.limit).subscribe(

      (response: any) => {

        this.logger.info('ContactsComponent: subscribe() success handler');

        this.count = response.body.page.totalElements;

        this.logger.info('count: ' + this.count);

        if (this.count > 0) {

          this.items = response.body._embedded.individualModels.map(
            (item => this.entityAdapter.adapt(item)));

        } else {

          const items = [];

          items.push(new Contact());

          this.items = items;
        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      },
      (error) => {

        this.logger.error('ContactsComponent: subscribe() error handler');

        this.items = [];

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      },
      () =>  {

        this.logger.info('ContactsComponent: subscribe() completion handler');
      }

    );

  }

*/

/*


  private findByFamilyNameStartsWith() {

    this.subscription = this.entityService.findByFamilyNameStartsWith(this.filter, this.offset, this.limit).subscribe(

      (response: any) => {

        this.logger.info('ContactsComponent: find() success handler');

        this.count = response.body.page.totalElements;
        this.items = response.body._embedded.individualModels.map((item => this.entityAdapter.adapt(item)));

        // this.logger.info('count: ' + this.count);
        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      },
      (error) => {

        this.logger.error('ContactsComponent: findAll() error handler');

        this.items = [];

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      },
      () =>  {

        this.logger.info('ContactsComponent: find() completion handler');
      }

    );

  }

  protected subscribe() {

    this.logger.info('ContactsComponent: subscribe()');

    this.subscription = this.entityService.find(this.offset, this.limit, this.filter).subscribe(

      (response: any) => {

        this.logger.info('ContactsComponent: subscribe() success handler');

        this.count = response.body.meta.count;
        this.items = response.body.data.map((item => this.entityAdapter.adapt(item)));

        // this.logger.info('count: ' + response.body.meta.count);
        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      },
      (error) => {

        this.logger.error('ContactsComponent: subscribe() error handler');

        this.items = [];

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      },
      () =>  {

        this.logger.info('ContactsComponent: subscribe() completion handler');
      }

    );

  }

*/
