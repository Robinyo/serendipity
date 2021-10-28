import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss' ],
})
export class AlertDialogComponent {

  public title: string | undefined;
  public message: string | undefined;
  public closeButton = 'CLOSE';

  constructor(private dialogRef: MatDialogRef<AlertDialogComponent>) {}

  public onClose(): void {
    this.dialogRef.close();
  }

}
