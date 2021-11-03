import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'auth-lib';
import { DialogService, SnackBarComponent } from 'serendipity-components-lib';
import { LoggerService } from 'utils-lib';

import { Account } from '../../../models/account';

export interface DialogResult {
  result: boolean,
  action?: string,
  record?: any
}

@Component({
  selector: 'party-lookup-account-dialog',
  template: `

    <h2 mat-dialog-title>Lookup record</h2>

    <mat-dialog-content class="mat-typography">

      <party-account-list (selectEvent)="onSelectEvent($event)"> </party-account-list>

    </mat-dialog-content>

    <mat-dialog-actions align="end">

      <button mat-raised-button
              color="accent"
              #addBtn
              [disabled]="isDisabled()"
              (keydown.arrowright)="removeBtn.focus()"
              (click)="onAdd()">
        {{ addButton }}
      </button>

      <button mat-raised-button
              color="accent"
              #removeBtn
              (keydown.arrowright)="cancelBtn.focus()"
              (click)="onRemove()">
        {{ removeButton }}
      </button>

      <button mat-raised-button
              cdkFocusInitial
              #cancelBtn
              (keydown.arrowleft)="removeBtn.focus()"
              (click)="onCancel()">
        {{ cancelButton }}
      </button>

    </mat-dialog-actions>

  `,
  styleUrls: ['../dialog-styles.scss' ]
})
export class LookupAccountDialogComponent implements OnInit {

  public message!: string;
  public title!: string;
  public addButton = 'ADD';
  public cancelButton = 'CANCEL';
  public removeButton = 'REMOVE';

  private currentUser: any;
  private disabled = true;
  private selectedItem!: any;

  constructor(private authService: AuthService,
              private dialogRef: MatDialogRef<LookupAccountDialogComponent>,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService) {}

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

      this.disabled = false;

    } else {

      this.disabled = true;

    }

  }

  //
  // Action bar events
  //

  public onAdd(): void {

    this.logger.info('LookupAccountDialogComponent: onAdd()');

    this.dialogRef.close({
      result: true,
      action: 'add',
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
  // Validation
  //

  public isDisabled(): boolean {
    return this.disabled;
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
