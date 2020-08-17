import { Component } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { CollectionComponent } from 'serendipity-components';

import { AccountAdapter } from '../../adapters/account.adapter';
import { AccountsService } from '../../services/accounts/accounts.service';

import { Account } from '../../models/account';
import { ACCOUNTS_COLUMN_DEFS } from '../../models/column-defs';
import { ACCOUNTS_COLUMNS_DESKTOP, ACCOUNTS_COLUMNS_MOBILE } from '../../models/constants';

@Component({
  selector: 'sales-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent extends CollectionComponent<Account> {

  constructor(private entityAdapter: AccountAdapter,
              private entityService: AccountsService) {

    super({
      columnDefsFilename: ACCOUNTS_COLUMN_DEFS,
      desktopDeviceColumns: ACCOUNTS_COLUMNS_DESKTOP,
      mobileDeviceColumns: ACCOUNTS_COLUMNS_MOBILE,
      limit: 10
    });

  }

  protected subscribe() {

    this.logger.info('AccountsComponent: subscribe()');

    this.subscription = this.entityService.find(this.offset, this.limit, this.filter).subscribe(

      (response: any) => {

        this.logger.info('ContactsComponent: subscribe() success handler');

        this.count = response.body.page.totalElements;

        this.logger.info('count: ' + this.count);

        if (this.count > 0) {

          this.items = response.body._embedded.organisationModels.map(
            (item => this.entityAdapter.adapt(item)));

        } else {

          this.items = [];
          this.items.push(new Account());

        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      },
      (error) => {

        this.logger.error('AccountsComponent: subscribe() error handler');

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

        this.logger.info('AccountsComponent: subscribe() completion handler');
      }

    );

  }

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('AccountsComponent: onNew()');

    // this.router.navigate(['sales/accounts/new']);
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
  .reduce((accumulator: any, key: string) => {
    return accumulator ? accumulator[key] : undefined;
  }, item);
}
