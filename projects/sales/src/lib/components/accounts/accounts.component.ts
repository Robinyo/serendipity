import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { TranslateService } from '@ngx-translate/core';

import { DialogService } from 'serendipity-components';

import { AccountsService } from '../../services/accounts/accounts.service';
import { ColumnDef } from '../../models/column';
import { ACCOUNTS_COLUMN_DEFS } from '../../models/column-defs';
import { Account } from '../../models/account';
import { AccountAdapter } from '../../adapters/account.adapter';

import { CollectionComponent } from '../abstract/collection.component';

import {
  ALPHABET,
  ACCOUNTS_COLUMNS_DESKTOP,
  ACCOUNTS_COLUMNS_MOBILE,
  MAT_XSMALL
} from '../../models/constants';

import { ConfigService } from 'utils';

import { SidenavService } from 'serendipity-components';

const ALL = 'All';

@Component({
  selector: 'sales-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent extends CollectionComponent implements AfterViewInit, OnInit {

  @ViewChild(MatSort, {static: false})
  public sort: MatSort;

  public items: Array<Account>;

  public dataSource: MatTableDataSource<Account> = null;
  public displayedColumns: string[] = [];

  public alphabet = ALPHABET;

  public columnDefs: ColumnDef[];

  public selectedFooterItemId = ALL;

  public pageNumber = 1;

  private count = 0;

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver,
              private adapter: AccountAdapter,
              private configService: ConfigService,
              private accountsService: AccountsService,
              private dialogService: DialogService,
              private translate: TranslateService,
              private commandBarSidenavService: SidenavService) {

    super();

    this.limit = 10;
  }

  public ngOnInit() {

    super.ngOnInit();

    this.logger.info('AccountsComponent: ngOnInit()');

    // Evaluate against the current viewport

    if (this.breakpointObserver.isMatched(MAT_XSMALL)) {
      this.displayedColumns = ACCOUNTS_COLUMNS_MOBILE;
    } else {
      this.displayedColumns = ACCOUNTS_COLUMNS_DESKTOP;
    }

    this.loadColumnDefs();

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

  async loadColumnDefs() {

    this.columnDefs = await this.configService.get(ACCOUNTS_COLUMN_DEFS);

    this.columnDefs.forEach(column => {

      this.translate.get(column.displayName).subscribe(value => {
        column.displayName = value;
      });

    });

  }

  protected subscribe() {

    this.logger.info('AccountsComponent: subscribe()');

    this.subscription = this.accountsService.find(this.offset, this.limit, this.filter).subscribe(

      (response: any) => {

        this.logger.info('ContactsComponent: subscribe() success handler');

        this.count = response.body.meta.count;
        this.items = response.body.data.map((item => this.adapter.adapt(item)));

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

  public refresh() {

    this.logger.info('AccountsComponent: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public onClickFilterButton(id: string) {

    this.logger.info('AccountsComponent: onClickFilterButton()');

    this.logger.info('Button Id: ' + id);

    this.selectedFooterItemId = id;

    this.filter = this.selectedFooterItemId;

    if (this.selectedFooterItemId === ALL) {
      this.filter = '';
    }

    // this.logger.info('Filter value: ' + id);

    this.offset = 0;
    this.pageNumber = 1;

    this.refresh();
  }

  public canClickPreviousPageButton() {

    this.logger.info('AccountsComponent: canClickPreviousPageButton()');

    return (this.offset - this.limit) >= 0;
  }

  public onClickPreviousPageButton() {

    this.logger.info('AccountsComponent: onClickPreviousPageButton()');

    this.offset = this.offset - this.limit;

    if (this.offset < 0) {
      this.offset = 0;
    }

    this.pageNumber--;

    this.refresh();
  }

  public canClickNextPageButton() {

    this.logger.info('AccountsComponent: canClickNextPageButton()');

    if (this.count === 0) {
      return false;
    }

    const pages = Math.ceil(this.count / this.limit);

    this.logger.info('pages: ' + pages);
    this.logger.info('this.pageNumber: ' + this.pageNumber);

    return (pages - this.pageNumber) > 0;
  }

  public onClickNextPageButton() {

    this.logger.info('AccountsComponent: onClickNextPageButton()');

    this.offset = this.offset + this.limit;

    this.pageNumber++;

    this.refresh();
  }

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('AccountsComponent: onNew()');

    this.router.navigate(['sales/contacts/new']);
  }

  public onToggleSidenav() {

    this.logger.info('AccountsComponent: onToggleSidenav()');

    this.commandBarSidenavService.toggle();
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
  .reduce((accumulator: any, key: string) => {
    return accumulator ? accumulator[key] : undefined;
  }, item);
}
