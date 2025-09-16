import { SelectionModel } from "@angular/cdk/collections";
import {Component, EventEmitter, inject, Output} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { RoleAdapter } from '../../../adapters/role';
import { RelationshipsService } from '../../../services/relationships/relationships';

import { RelationshipList } from "./relationship-list";

import { ContactModel } from '../../../models/contact';
import { RoleModel } from '../../../models/role';

@Component({
  selector: 'contact-relationship-list',
  imports: [

  ],
  templateUrl: './contact-relationship-list.html',
  standalone: true,
  styleUrls: ['./contact-relationship-list.scss']
})
export class ContactRelationshipList extends RelationshipList<ContactModel> {

  @Output() selectEvent = new EventEmitter<RoleModel>();

  public placeholder = false;

  selection = new SelectionModel<RoleModel>(false, []);

  private entityAdapter: RoleAdapter = inject(RoleAdapter);
  private entityService: RelationshipsService = inject(RelationshipsService);

  constructor() {
    super();
  }

  protected subscribe() {

    this.logger.info('RelationshipListComponent: subscribe()');

    this.isLoading = true;

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
          this.items.push(new RoleModel());

          this.placeholder = true;

        }

        this.isLoading = false;

        // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;

        this.detectChanges();

      },
      (error) => {

        this.logger.error('Relationship List Component: subscribe() error handler');

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

        this.logger.info('Relationship List Component: subscribe() completion handler');
      }

    );

  }

  selectHandler(row: RoleModel) {

    if (!this.selection.isSelected(row)) {
      this.selection.clear();
    }

    this.selection.toggle(row);

    if (this.selection.isSelected(row)) {
      this.selectEvent.emit(row);
    } else {
      this.selectEvent.emit(new RoleModel());
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
