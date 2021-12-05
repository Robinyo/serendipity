import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { RoleAdapter } from '../../adapters/role.adapter';
import { RelationshipsService } from '../../services/relationships/relationships.service';

import { RelationshipListComponent } from "../abstract/relationship-list/relationship-list.component";

import { Contact } from '../../models/contact';
import { Role } from '../../models/role';

@Component({
  selector: 'contact-relationship-list',
  templateUrl: './contact-relationship-list.component.html',
  styleUrls: ['./contact-relationship-list.component.scss']
})
export class ContactRelationshipListComponent extends RelationshipListComponent<Contact> {

  public placeholder = false;

  @Output() selectEvent = new EventEmitter<Role>();

  selection = new SelectionModel<Role>(false, []);

  constructor(private entityAdapter: RoleAdapter,
              private entityService: RelationshipsService) {
    super();
  }

  protected subscribe() {

    this.logger.info('RelationshipListComponent: subscribe()');

    // @ts-ignore
    this.subscription = this.entityService.findByPartyId(this.item.party.id, this.offset, this.limit,).subscribe(

      (response: any) => {

        this.logger.info('RelationshipListComponent: subscribe() success handler');

        this.count = response.body.page.totalElements;

        this.logger.info('response.body: ' + JSON.stringify(response.body, null, 2));

        this.logger.info('count: ' + this.count);

        if (this.count > 0) {

          this.items = response.body._embedded.roleModels.map(
            ((item: any) => this.entityAdapter.adapt(item)));

          this.placeholder = false;

        } else {

          this.items = [];
          this.items.push(new Role());

          this.placeholder = true;

        }

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

      },
      (error) => {

        this.logger.error('RelationshipListComponent: subscribe() error handler');

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

        this.logger.info('RelationshipListComponent: subscribe() completion handler');
      }

    );

  }

  selectHandler(row: Role) {

    if (!this.selection.isSelected(row)) {
      this.selection.clear();
    }

    this.selection.toggle(row);

    if (this.selection.isSelected(row)) {
      this.selectEvent.emit(row);
    } else {
      this.selectEvent.emit(new Role());
    }

  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
    .reduce((accumulator: any, key: string) => {
      return accumulator ? accumulator[key] : undefined;
    }, item);
}
