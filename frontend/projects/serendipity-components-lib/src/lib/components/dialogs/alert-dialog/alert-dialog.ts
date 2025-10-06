import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'alert-dialog',
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
              cdkFocusInitial
              color="accent"
              (click)="onClose()">
        {{ closeButton }}
      </button>

    </mat-dialog-actions>

  `,
  styleUrls: ['../styles.scss' ]
})
export class AlertDialog {

  public message: string | undefined;
  public title: string | undefined;

  public closeButton = 'CLOSE';

  constructor(private dialogRef: MatDialogRef<AlertDialog>) {}

  public onClose(): void {
    this.dialogRef.close();
  }

}
