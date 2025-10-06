import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  template: `

    @if (title) {
      <h3 mat-dialog-title class="dialog-title"> {{ title }} </h3>
    }

    <mat-dialog-content class="dialog-content">

      <span class="dialog-message"> {{ message }} </span>

    </mat-dialog-content>

    <mat-dialog-actions align="end">

      <button mat-button
              #cancelBtn
              (keydown.arrowright)="acceptBtn.focus()"
              (click)="onCancel()">
        {{ cancelButton }}
      </button>

      <button mat-button
              color="accent"
              #acceptBtn
              (keydown.arrowleft)="cancelBtn.focus()"
              (click)="onAccept()">
        {{ acceptButton }}
      </button>

    </mat-dialog-actions>

  `,
  styleUrls: ['../styles.scss' ]
})
export class ConfirmDialog {

  public message: string | undefined;
  public title: string | undefined;

  public acceptButton = 'ACCEPT';
  public cancelButton = 'CANCEL';

  constructor(private dialogRef: MatDialogRef<ConfirmDialog>) {}

  public onAccept(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

}
