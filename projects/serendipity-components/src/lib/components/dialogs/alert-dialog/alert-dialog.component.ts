import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'crm--alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss' ],
})
export class AlertDialogComponent {

  title: string;
  message: string;
  closeButton = 'CLOSE';

  constructor(private dialogRef: MatDialogRef<AlertDialogComponent>) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
