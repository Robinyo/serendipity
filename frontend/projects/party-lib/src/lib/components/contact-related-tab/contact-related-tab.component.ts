import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { Subscription } from "rxjs";

import { SnackBarComponent, TabComponent } from 'serendipity-components-lib';

import { ContactsService } from '../../services/contacts/contacts.service';

import { ContactRelationshipListComponent } from '../contact-relationship-list/contact-relationship-list.component';

import { AddRelationshipDialogComponent } from "../dialogs/add-relationship-dialog/add-relationship-dialog.component";

import { Contact } from '../../models/contact';
import { DialogResult } from "../../models/dialog";
import { Role } from '../../models/role';

@Component({
  selector: 'contact-related-tab',
  templateUrl: './contact-related-tab.component.html',
  styleUrls: ['./contact-related-tab.component.scss']
})
export class ContactRelatedTabComponent extends TabComponent<Contact> implements AfterViewInit {

  public addButtonLabel = 'ADD';
  public removeButtonLabel = 'REMOVE';

  public disableAddButton = false;
  public disableRemoveButton = true;

  @ViewChild(ContactRelationshipListComponent, {static: false})
  private contactRelationshipListComponent!: ContactRelationshipListComponent;

  private selectedItem!: Role;

  constructor(private entityService: ContactsService) {
    super();
  }

  public ngAfterViewInit() {

    this.logger.info('ContactRelatedTabComponent: ngAfterViewInit()');

    if (this.item.party.roles.length === 0) {
      this.disableRemoveButton = true;
    }

  }

  public onSelectEvent(role: Role) {

    this.logger.info('ContactRelatedTabComponent: onSelectEvent()');

    if (role.id !== undefined) {

      this.selectedItem = role;

      this.logger.info('selectedItem: ' + JSON.stringify(this.selectedItem, null, 2));

      this.disableAddButton = true;

    } else {

      this.disableAddButton = false;

    }

    this.disableRemoveButton = !this.disableAddButton;

    if (this.item.party.roles.length === 0) {
      this.disableRemoveButton = true;
    }

  }

  //
  // Action Bar events
  //

  public onAdd(): void {

    this.logger.info('ContactRelatedTabComponent: onAdd()');

    this.openAddRelationshipAccountDialog();
  }

  private openAddRelationshipAccountDialog() {

    this.logger.info('ContactRelatedTabComponent: openAddRelationshipAccountDialog()');

    let config = { item: this.item };

    const dialogRef = this.dialogService.open(AddRelationshipDialogComponent, { data: config });

    dialogRef.afterClosed().subscribe((response: DialogResult) => {

      this.logger.info('result: ' + JSON.stringify(response, null, 2) + '\n');

      if (!response.result) { return; }

      switch (response.action) {

        case 'ok':

          this.openSnackBar('Role added');

          this.contactRelationshipListComponent.refresh();

          break;

        default:

          this.logger.error('openLookupAccountDialog() -> default');
          break;

      }

    });

  }

  public onRemove(): void {

    this.logger.info('ContactRelatedTabComponent: onRemove()');

    this.dialogService.openConfirm({
      title: 'Role',
      message: 'Are you sure you want to delete this role?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      if (response) {

        this.logger.info('ContactRelatedTabComponent onRemove() response: true');

        this.item.party.roles.every((role, index) => {

          if (role.id === this.selectedItem.id) {

            this.logger.info('remove -> role.id === this.selectedItem.id');

            this.logger.info('deleteRole() -> this.item.party.id: ' + this.item.party.id + ' role.id: ' + role.id);

            // @ts-ignore
            const subscription: Subscription = this.entityService.deleteRole(this.item.party.id, role.id).subscribe(() => {

              // remove the Role
              this.item.party.roles.splice(index, 1);

              if (role.role === 'Contact' && role.reciprocalRole === 'Account') {

                this.logger.info('role === Contact && reciprocalRole === Account');

                // Organisation Ref
                this.item.organisation.id = '';
                this.item.organisation.displayName = '';
                this.item.organisation.email = '';
                this.item.organisation.phoneNumber = '';

              }

              this.openSnackBar('Role removed');

              this.contactRelationshipListComponent.refresh();

              subscription.unsubscribe();

            });

            return false;
          }

          return true;

        });

        this.disableRemoveButton = true;
        this.disableAddButton = !this.disableRemoveButton;

      }

    });

  }

  private openSnackBar(message: string): void {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'md-snack-bar'
    });

  }

}
