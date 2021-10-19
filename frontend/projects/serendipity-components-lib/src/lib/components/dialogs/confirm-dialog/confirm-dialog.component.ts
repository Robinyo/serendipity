import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'crm-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  public title: string | undefined;
  public message: string | undefined;
  public cancelButton = 'CANCEL';
  public acceptButton = 'ACCEPT';

  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  public onAccept(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

}
