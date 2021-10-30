import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { CollectionComponent } from 'serendipity-components-lib';

import { AccountAdapter } from '../../adapters/account.adapter';
import { AccountsService } from '../../services/accounts/accounts.service';

import { Account } from '../../models/account';
import { ACCOUNT_LIST_COLUMN_DEFS } from '../../models/column-defs';
import { ACCOUNT_LIST_COLUMNS_DESKTOP, ACCOUNT_LIST_COLUMNS_MOBILE } from '../../models/constants';

@Component({
  selector: 'party-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent extends CollectionComponent<Account> {

  @Output() selectEvent = new EventEmitter<Account>();

  selection = new SelectionModel<Account>(false, []);

  constructor(private entityAdapter: AccountAdapter,
              private entityService: AccountsService) {

    super({
      columnDefsFilename: ACCOUNT_LIST_COLUMN_DEFS,
      desktopDeviceColumns: ACCOUNT_LIST_COLUMNS_DESKTOP,
      mobileDeviceColumns: ACCOUNT_LIST_COLUMNS_MOBILE,
      limit: 10
    });

  }

  protected subscribe() {

    this.logger.info('AccountListComponent: subscribe()');

    this.subscription = this.entityService.find(this.offset, this.limit, this.filter).subscribe(

      (response: any) => {

        this.logger.info('AccountListComponent: subscribe() success handler');

        this.count = response.body.page.totalElements;

        this.logger.info('count: ' + this.count);

        if (this.count > 0) {

          this.items = response.body._embedded.organisationModels.map(
            ((item: any) => this.entityAdapter.adapt(item)));

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

        this.logger.error('AccountListComponent: subscribe() error handler');

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

        this.logger.info('AccountListComponent: subscribe() completion handler');
      }

    );

  }

  selectHandler(row: Account) {

    if (!this.selection.isSelected(row)) {
      this.selection.clear();
    }

    this.selection.toggle(row);

    if (this.selection.isSelected(row)) {
      this.selectEvent.emit(row);
    } else {
      this.selectEvent.emit(new Account());
    }

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
