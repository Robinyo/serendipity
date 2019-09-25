import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subscription} from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

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

  public selectedFooterItemId = 'All';

  protected subscription: Subscription;

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver,
              private configService: ConfigService,
              private contactsService: ContactsService,
              private translate: TranslateService,
              private commandBarSidenavService: SidenavService) {

    super();
  }

  public ngOnInit() {

    super.ngOnInit();

    this.logger.info('ContactsPage: ngOnInit()');

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

    this.logger.info('ContactsPage: ngAfterViewInit()');

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

  // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

  protected subscribe() {

    this.logger.info('ContactsPage: subscribe()');

    this.subscription = this.contactsService.find().subscribe(data => {

      // this.logger.info('ContactsPage subscribe() data: ' + JSON.stringify(data));

      this.items = data;

      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.data = this.items;
      this.dataSource.sortingDataAccessor = pathDataAccessor;
      this.dataSource.sort = this.sort;
    });

  }

  public refresh() {

    this.logger.info('ContactsPage: refresh()');
  }

  public onClickFilterButton(id: string) {

    this.logger.info('ContactsPage: onClickFilterButton()');

    this.logger.info('Button Id: ' + id);

    this.selectedFooterItemId = id;
  }

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('ContactsPage: onNew()');

    this.router.navigate(['sales/contacts/new']);
  }

  public onToggleSidenav() {

    this.logger.info('ContactsPage: onToggleSidenav()');

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
