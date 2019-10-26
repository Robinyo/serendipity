import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subscription} from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DialogService } from 'serendipity-components';

import { ContactsService } from '../../services/contacts/contacts.service';
import { ColumnDef } from '../../models/column';
import { Contact } from '../../models/contact';

import { CollectionComponent } from '../abstract/collection.component';

import {
  ALPHABET,
  CONTACT_COLUMNS_DESKTOP,
  CONTACT_COLUMNS_MOBILE,
  MAT_XSMALL
} from '../../models/constants';

import { ConfigService } from 'utils';

import { SidenavService } from 'serendipity-components';

const ALL = 'All';

@Component({
  selector: 'sales-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent extends CollectionComponent implements AfterViewInit, OnInit {

  @ViewChild(MatSort, {static: false})
  public sort: MatSort;

  public items: Array<Contact>;

  public dataSource: MatTableDataSource<Contact> = null;
  public displayedColumns: string[] = [];

  public alphabet = ALPHABET;

  public columnDefs: ColumnDef[];

  public selectedFooterItemId = ALL;

  public pageNumber = 1;

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver,
              private configService: ConfigService,
              private contactsService: ContactsService,
              private dialogService: DialogService,
              private translate: TranslateService,
              private commandBarSidenavService: SidenavService) {

    super();

    this.limit = 10;
  }

  public ngOnInit() {

    super.ngOnInit();

    this.logger.info('ContactsComponent: ngOnInit()');

    // Evaluate against the current viewport

    if (this.breakpointObserver.isMatched(MAT_XSMALL)) {
      this.displayedColumns = CONTACT_COLUMNS_MOBILE;
    } else {
      this.displayedColumns = CONTACT_COLUMNS_DESKTOP;
    }

    this.loadColumnDefs();

  }

  // https://blog.angular-university.io/angular-debugging/

  public ngAfterViewInit() {

    this.logger.info('ContactsComponent: ngAfterViewInit()');

    // React to changes to the viewport

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {

      if (result.matches) {
        this.displayedColumns = CONTACT_COLUMNS_MOBILE;
      } else {
        this.displayedColumns = CONTACT_COLUMNS_DESKTOP;
      }

    });
  }

  async loadColumnDefs() {

    this.columnDefs = await this.configService.get('contacts-column-defs');

    this.columnDefs.forEach(column => {

      this.translate.get(column.displayName).subscribe(value => {
        column.displayName = value;
      });

    });

  }

  // protected subscribe(offset: number, limit: number) {
  protected subscribe() {

    this.logger.info('ContactsComponent: subscribe()');

    this.subscription = this.contactsService.find(this.offset, this.limit, this.filter).subscribe(

      (data: Array<Contact>) => {

      this.logger.info('ContactsComponent: subscribe() success handler');

      // this.logger.info('ContactsComponent subscribe() data: ' + JSON.stringify(data));

      this.items = data;

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

  public refresh() {

    this.logger.info('ContactsComponent: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public onClickFilterButton(id: string) {

    this.logger.info('ContactsComponent: onClickFilterButton()');

    this.logger.info('Button Id: ' + id);

    this.selectedFooterItemId = id;

    this.filter = this.selectedFooterItemId;

    if (this.selectedFooterItemId === ALL) {
      this.filter = '';
    }

    // this.logger.info('Filter value: ' + id);

    this.refresh();
  }

  public canClickPreviousPageButton() {

    this.logger.info('ContactsComponent: canClickPreviousPageButton()');

    return (this.offset - this.limit) >= 0;
  }

  public onClickPreviousPageButton() {

    this.logger.info('ContactsComponent: onClickPreviousPageButton()');

    this.offset = this.offset - this.limit;

    if (this.offset < 0) {
      this.offset = 0;
    }

    this.pageNumber--;

    this.refresh();
  }

  public onClickNextPageButton() {

    this.logger.info('ContactsComponent: onClickNextPageButton()');

    this.offset = this.offset + this.limit;

    this.pageNumber++;

    this.refresh();
  }

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('ContactsComponent: onNew()');

    this.router.navigate(['sales/contacts/new']);
  }

  public onToggleSidenav() {

    this.logger.info('ContactsComponent: onToggleSidenav()');

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

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

/*

    // btoa(0) === 'MA=='
    // this.router.navigate(['sales/contacts/MA==', { new: true }]);

*/

// this.logger.info('ContactsPage subscribe() data: ' + JSON.stringify(data));

/*
data.map(a => {

  // a.id = btoa(a.id);
  a.party.id = btoa(a.party.id);

  if (a.party.roles.length) {

    a.organisation = {
      name: a.party.roles[0].reciprocalPartyName,
      phoneNumber: a.phoneNumber
    };

  }

  return { ...a };

});
*/
