import { Component, OnInit } from '@angular/core';

import { Subscription} from 'rxjs';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../models/contact';

interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'sales-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
  // providers: [ { provide: LoggerService, useClass: ConsoleLoggerService } ]
})
export class AccountsComponent implements OnInit {

  protected subscription: Subscription;

  public items: Array<Contact>;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(private contactsService: ContactsService) {

  }

  public ngOnInit() {

    this.subscribe();
  }

  protected subscribe() {

    this.subscription = this.contactsService.find().subscribe(data => {

      this.items = data;
      // this.dataSource.data = this.items;

      // console.log(JSON.stringify(this.items));

    });

  }

}
