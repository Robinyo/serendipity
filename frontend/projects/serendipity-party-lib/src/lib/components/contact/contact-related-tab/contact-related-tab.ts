import { AfterViewInit, Component, ViewChild} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { Subscription } from "rxjs";

import { SnackBar, Tab } from 'serendipity-components-lib';

import { ContactsService } from '../../../services/contacts/contacts';

import { ContactRelationshipList } from '../contact-relationship-list/contact-relationship-list';

// import { AddRelationshipDialogComponent } from "../dialogs/add-relationship-dialog/add-relationship-dialog";

import { ContactModel } from '../../../models/contact';
import { DialogResult } from "../../../models/dialog";
import { RoleModel } from '../../../models/role';

@Component({
  selector: 'contact-related-tab',
  imports: [
    MatButtonModule,
    ContactRelationshipList,
    MatExpansionModule
  ],
  templateUrl: 'contact-related-tab.html',
  standalone: true,
  styleUrls: ['contact-related-tab.scss']
})
export class ContactRelatedTab extends Tab<ContactModel> implements AfterViewInit {

  public addButtonLabel = 'ADD';
  public removeButtonLabel = 'REMOVE';

  public disableAddButton = false;
  public disableRemoveButton = true;

  @ViewChild(ContactRelationshipList, {static: false})
  private contactRelationshipListComponent!: ContactRelationshipList;

  private selectedItem!: RoleModel;

  constructor(private entityService: ContactsService) {
    super();
  }

  public ngAfterViewInit() {

    this.logger.info('Contact Related Tab Component: ngAfterViewInit()');

    if (this.item.party.roles.length === 0) {
      this.disableRemoveButton = true;
    }

  }

  public onSelectEvent(role: RoleModel) {

    this.logger.info('Contact Related Tab Component: onSelectEvent()');

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

    this.logger.info('Contact Related Tab Component: onAdd()');

    this.openAddRelationshipAccountDialog();
  }

  private openAddRelationshipAccountDialog() {

    this.logger.info('Contact Related Tab Component: openAddRelationshipAccountDialog()');

  }

  /*

  private openAddRelationshipAccountDialog() {

    this.logger.info('Contact Related Tab Component: openAddRelationshipAccountDialog()');

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

  */

  public onRemove(): void {

    this.logger.info('Contact Related Tab Component: onRemove()');

    this.dialogService.openConfirm({
      title: 'Role',
      message: 'Are you sure you want to delete this role?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      if (response) {

        this.logger.info('Contact Related Tab Component onRemove() response: true');

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

    this.snackBar.openFromComponent(SnackBar, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'md-snack-bar'
    });

  }

}
