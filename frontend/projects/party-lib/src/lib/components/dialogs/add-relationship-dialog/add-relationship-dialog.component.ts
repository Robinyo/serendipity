import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { DialogService, SnackBarComponent } from 'serendipity-components-lib';
import { LoggerService } from 'utils-lib';

import { LookupAccountDialogComponent } from "../lookup-account-dialog/lookup-account-dialog.component";

import { DialogResult } from "../../../models/dialog";
import { PartyType } from '../../../types/party-type';
import { Role } from '../../../models/role';

interface RoleClassificationScheme {
  role: string;
  partyType: string;
  relationship: string;
  reciprocalRole: string;
  reciprocalPartyType: string;
}

const DEFAULT_FOOTER_COL_SPAN = 5;
const RELATIONSHIP_LIST_COLUMNS = [ 'partyName', 'role', 'relationship', 'reciprocalRole', 'reciprocalPartyName' ];

@Component({
  selector: 'party-add-relationship-dialog',
  template: `

    <h2 mat-dialog-title>Add relationship</h2>

    <mat-dialog-content class="mat-typography">

      <!-- <div class="lookup-list-container"> -->
      <div>

        <table mat-table
               [hidden]="!items"
               [dataSource]="dataSource"
               matSort
               matSortStart="desc"
               matSortDisableClear>

          <!-- Name Column -->

          <ng-container matColumnDef="partyName">
            <!-- See: .scss for mat-column styles -->
            <th mat-header-cell *matHeaderCellDef> NAME </th>
            <td mat-cell *matCellDef="let element">  {{ element.partyName }} </td>
          </ng-container>

          <!-- Role Column -->

          <ng-container matColumnDef="role">

            <!-- See: .scss for mat-column styles -->
            <th mat-header-cell *matHeaderCellDef> ROLE </th>
            <td mat-cell *matCellDef="let element">

              <mat-select [(value)]="role" (selectionChange)="onSelectionChange()" >
                <mat-option *ngFor="let element of scheme" [value]="element.role">
                  {{ element.role }}
                </mat-option>
              </mat-select>

            </td>
          </ng-container>

          <ng-container matColumnDef="relationship">
            <!-- See: .scss for mat-column styles -->
            <th mat-header-cell *matHeaderCellDef> RELATIONSHIP </th>
            <td mat-cell *matCellDef="let element">  {{ element.relationship }} </td>
          </ng-container>

          <ng-container matColumnDef="reciprocalRole">
            <!-- See: .scss for mat-column styles -->
            <th mat-header-cell *matHeaderCellDef> RECIPROCAL ROLE </th>
            <td mat-cell *matCellDef="let element">  {{ element.reciprocalRole }} </td>
          </ng-container>

          <ng-container matColumnDef="reciprocalPartyName">
            <!-- See: .scss for mat-column styles -->
            <th mat-header-cell *matHeaderCellDef> NAME </th>
            <td mat-cell *matCellDef="let element">

              <div class="md-input">
                <div class="md-input-trigger">

                  <div class="md-input-value">
                    <span class="md-input-value-text">
                      {{ element.reciprocalPartyName }}
                    </span>
                  </div>

                  <div class="md-input-search-wrapper">
                    <mat-icon matSuffix svgIcon="search"
                              (click)="reciprocalPartyNameClickHandler()">
                    </mat-icon>
                  </div>

                </div>
              </div>

            </td>
          </ng-container>

          <!-- Footer -->

          <ng-container matColumnDef="footer">
            <td mat-footer-cell *matFooterCellDef [attr.colspan]="footerColSpan">
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          <tr mat-footer-row *matFooterRowDef="['footer']; sticky: true"></tr>

        </table>

      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end">

      <button mat-raised-button
              color="accent"
              #okButton
              [disabled]="disableOkButton"
              (keydown.arrowright)="cancelButton.focus()"
              (click)="onOk()">
        {{ okButtonLabel }}
      </button>

      <button mat-raised-button
              cdkFocusInitial
              #cancelButton
              (keydown.arrowleft)="okButton.focus()"
              (click)="onCancel()">
        {{ cancelButtonLabel }}
      </button>

    </mat-dialog-actions>

  `,
  styleUrls: ['add-relationship-dialog.component.scss']
})
export class AddRelationshipDialogComponent implements OnInit {

  public item!: any;             // Contact or Account
  public reciprocalParty!: any;  // Contact or Account

  public items!: Array<Role>;
  public dataSource!: MatTableDataSource<Role>;
  public displayedColumns = RELATIONSHIP_LIST_COLUMNS;
  public footerColSpan = DEFAULT_FOOTER_COL_SPAN;

  public scheme!: RoleClassificationScheme[];
  public role!: string;

  public cancelButtonLabel = 'CANCEL';
  public okButtonLabel = 'OK';

  public disableOkButton = true;

  private currentUser: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {item: any},
              private dialogRef: MatDialogRef<AddRelationshipDialogComponent>,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService) {

    this.logger.info('AddRelationshipDialogComponent: constructor()');

    this.logger.info('data: ' + JSON.stringify(data, null, 2) + '\n');

    this.item = data.item;
  }

  public ngOnInit() {

    this.logger.info('AddRelationshipDialogComponent: ngOnInit()');

    // this.logger.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));

    if (this.item.party.type === PartyType.INDIVIDUAL) {

      this.scheme = [
        { role: 'Member',
          partyType: PartyType.INDIVIDUAL,
          relationship: 'Membership',
          reciprocalRole: 'Political Party',
          reciprocalPartyType: PartyType.ORGANISATION
        },
        { role: 'Investor',
          partyType: PartyType.INDIVIDUAL,
          relationship: 'Investment Management',
          reciprocalRole: 'Advisor',
          reciprocalPartyType: PartyType.INDIVIDUAL
        }
      ];

      this.role = this.scheme[0].role;

    } else {

      // PartyType.ORGANISATION

      this.scheme = [
        { role: 'Public Officer',
          partyType: PartyType.ORGANISATION,
          relationship: 'Office Holder',
          reciprocalRole: 'Authorised Contact',
          reciprocalPartyType: PartyType.INDIVIDUAL
        },
        { role: 'Employer',
          partyType: PartyType.ORGANISATION,
          relationship: 'Employment',
          reciprocalRole: 'Employee',
          reciprocalPartyType: PartyType.INDIVIDUAL
        }
      ];

      this.role = this.scheme[0].role;

    }

    this.items = [];
    this.items.push(new Role(
      this.role,
      this.item.party.id,
      this.item.party.type,
      this.item.party.displayName,
      this.item.email,
      this.item.phoneNumber,
      this.scheme[0].relationship,
      this.scheme[0].reciprocalRole
      ));

    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.data = this.items;

  }

  //
  // Dynamic Form events
  //

  public onSelectionChange(): void {

    this.logger.info('AddRelationshipDialogComponent: onSelectionChange()');

    this.logger.info('role: ' + this.role);

    this.scheme.every((element, index) => {

      if (element.role === this.role) {

        this.logger.info('item.role === this.role');

        this.items[0].relationship = this.scheme[index].relationship;
        this.items[0].reciprocalRole = this.scheme[index].reciprocalRole;

        this.reciprocalParty = null;

        this.items[0].reciprocalPartyId = '';
        this.items[0].reciprocalPartyType = '';
        this.items[0].reciprocalPartyName = '';
        this.items[0].reciprocalPartyEmail = '';
        this.items[0].reciprocalPartyPhoneNumber = '';

        return false;
      }

      return true;

    });

  }

  public reciprocalPartyNameClickHandler(): void {

    this.logger.info('AddRelationshipDialogComponent: reciprocalPartyNameClickHandler()');

    if (this.items[0].reciprocalRole === PartyType.INDIVIDUAL) {

      this.logger.info('this.items[0].reciprocalRole === PartyType.INDIVIDUAL');

    } else {

      this.logger.info('this.items[0].reciprocalRole === PartyType.ORGANISATION');

      this.openLookupAccountDialog();

    }

  }

  private openLookupAccountDialog() {

    this.logger.info('AddRelationshipDialogComponent: openLookupAccountDialog()');

    let config = {
      disableRemoveButton: true,
      hideRemoveButton: true,
      addButtonLabel: 'OK'
    };

    const lookupAccountDialogRef = this.dialogService.open(LookupAccountDialogComponent, { data: config });

    lookupAccountDialogRef.afterClosed().subscribe((response: DialogResult) => {

      this.logger.info('response: ' + JSON.stringify(response, null, 2) + '\n');

      if (!response.result) { return; }

      switch (response.action) {

        case 'ok':

          this.reciprocalParty = response.record;

          this.items[0].reciprocalPartyId = this.reciprocalParty.party.id;
          this.items[0].reciprocalPartyType = this.reciprocalParty.party.type;
          this.items[0].reciprocalPartyName = this.reciprocalParty.party.displayName;
          this.items[0].reciprocalPartyEmail = this.reciprocalParty.email;
          this.items[0].reciprocalPartyPhoneNumber = this.reciprocalParty.phoneNumber;

          break;

        default:

          this.logger.error('openLookupAccountDialog() -> default');
          break;

      }

    });

  }

  //
  // Action Bar events
  //

  public onCancel(): void {

    this.dialogRef.close({
      result: false
    });

  }

  public onOk(): void {

    this.logger.info('AddRelationshipDialogComponent: onOk()');

    this.dialogRef.close({
      result: true,
      action: 'ok'
    });

  }

  //
  // Misc
  //

  private openSnackBar(message: string) {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'md-snack-bar'
    });

  }

  // https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

  public getProperty = (obj: any, path: any) => (
    path.split('.').reduce((o: any, p: any) => o && o[p], obj)
  )

}
