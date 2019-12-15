import { Component } from '@angular/core';

import { MatTableDataSource } from '@angular/material';

import { CollectionComponent } from '../collection/collection.component';

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
      mobileDeviceColumns: ACCOUNTS_COLUMNS_MOBILE
    });

  }

  protected subscribe() {

    this.logger.info('AccountsComponent: subscribe()');

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

/*

public ngOnInit() {

  super.ngOnInit();

  this.logger.info('AccountsComponent: ngOnInit()');

  // Evaluate against the current viewport

  if (this.breakpointObserver.isMatched(MAT_XSMALL)) {
    this.displayedColumns = ACCOUNTS_COLUMNS_MOBILE;
  } else {
    this.displayedColumns = ACCOUNTS_COLUMNS_DESKTOP;
  }

  this.loadColumnDefs(ACCOUNTS_COLUMN_DEFS);

}

// https://blog.angular-university.io/angular-debugging/

public ngAfterViewInit() {

  this.logger.info('AccountsComponent: ngAfterViewInit()');

  // React to changes to the viewport

  this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {

    if (result.matches) {
      this.displayedColumns = ACCOUNTS_COLUMNS_MOBILE;
    } else {
      this.displayedColumns = ACCOUNTS_COLUMNS_DESKTOP;
    }

  });
}

*/
