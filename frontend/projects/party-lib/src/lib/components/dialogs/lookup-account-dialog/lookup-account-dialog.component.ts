import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'auth-lib';
import { SnackBarComponent } from 'serendipity-components-lib';
import { LoggerService } from 'utils-lib';

import { Account } from '../../../models/account';

@Component({
  selector: 'party-lookup-account-dialog',
  template: `

    <h2 mat-dialog-title>Lookup record</h2>

    <mat-dialog-content class="mat-typography">

      <party-account-list (selectEvent)="onSelectEvent($event)"> </party-account-list>

    </mat-dialog-content>

    <ng-container *ngIf="hideRemoveButton; else showRemoveButton">

      <mat-dialog-actions align="end">

        <button mat-raised-button
                color="accent"
                #addButton
                [disabled]="disableAddButton"
                (click)="onAdd()">
          {{ addButtonLabel }}
        </button>

        <button mat-raised-button
                cdkFocusInitial
                #cancelButton
                (click)="onCancel()">
          {{ cancelButtonLabel }}
        </button>

      </mat-dialog-actions>

    </ng-container>

    <ng-template #showRemoveButton>

      <mat-dialog-actions align="end">

        <button mat-raised-button
                color="accent"
                #addButton
                [disabled]="disableAddButton"
                (keydown.arrowright)="removeButton.focus()"
                (click)="onAdd()">
          {{ addButtonLabel }}
        </button>

        <button mat-raised-button
                color="accent"
                #removeButton
                [hidden]="hideRemoveButton"
                [disabled]="disableRemoveButton"
                (keydown.arrowright)="cancelButton.focus()"
                (click)="onRemove()">
          {{ removeButtonLabel }}
        </button>

        <button mat-raised-button
                cdkFocusInitial
                #cancelButton
                (keydown.arrowleft)="removeButton.focus()"
                (click)="onCancel()">
          {{ cancelButtonLabel }}
        </button>

      </mat-dialog-actions>

    </ng-template>
  `,
  styleUrls: ['../dialog-styles.scss']
})
export class LookupAccountDialogComponent implements OnInit {

  public addButtonLabel = 'ADD';
  public cancelButtonLabel = 'CANCEL';
  public removeButtonLabel = 'REMOVE';

  public disableAddButton = true;
  public disableRemoveButton = true;
  public hideRemoveButton = true;

  private currentUser: any;
  private selectedItem!: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                disableRemoveButton: boolean,
                hideRemoveButton: boolean,
                addButtonLabel: string},
              private authService: AuthService,
              private dialogRef: MatDialogRef<LookupAccountDialogComponent>,
              private snackBar: MatSnackBar,
              private logger: LoggerService) {

    this.logger.info('LookupAccountDialogComponent: constructor()');

    this.logger.info('data: ' + JSON.stringify(data, null, 2) + '\n');

    this.disableRemoveButton = data.disableRemoveButton;
    this.hideRemoveButton = data.hideRemoveButton;
    this.addButtonLabel = data.addButtonLabel;
  }

  public ngOnInit() {

    this.logger.info('LookupAccountDialogComponent: ngOnInit()');

    this.currentUser = this.authService.getCurrentUser();

    this.logger.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));
  }

  public onSelectEvent(account: Account) {

    this.logger.info('LookupAccountDialogComponent: onSelectEvent()');

    if (account.id !== undefined) {

      this.selectedItem = account;

      this.logger.info('selectedItem: ' + JSON.stringify(this.selectedItem, null, 2));

      this.disableAddButton = false;

    } else {

      this.disableAddButton = true;

    }

    // If we haven't disabled the remove button, then when there isn't a selection, enable the remove button.

    if (!this.data.disableRemoveButton) {
      this.disableRemoveButton = !this.disableAddButton;
    }

  }

  //
  // Action Bar events
  //

  public onAdd(): void {

    this.logger.info('LookupAccountDialogComponent: onAdd()');

    const action = (this.addButtonLabel === 'ADD') ? 'add' : 'ok';

    this.dialogRef.close({
      result: true,
      action: action,
      record: this.selectedItem
    });

  }

  public onCancel(): void {

    this.dialogRef.close({
      result: false
    });

  }

  public onRemove(): void {

    this.logger.info('LookupAccountDialogComponent: onRemove()');

    this.dialogRef.close({
      result: true,
      action: 'remove'
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

}
