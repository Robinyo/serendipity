import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `

      <div *ngIf="title">
        <h3 mat-dialog-title class="dialog-title"> {{ title }} </h3>
      </div>

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
export class AlertDialogComponent {

  public message: string | undefined;
  public title: string | undefined;

  public closeButton = 'CLOSE';

  constructor(private dialogRef: MatDialogRef<AlertDialogComponent>) {}

  public onClose(): void {
    this.dialogRef.close();
  }

}

/*

    <div>

      <div mat-dialog-title *ngIf="title">
        <h3 class="dialog-title"> {{ title }} </h3>
      </div>

      <div mat-dialog-content class="dialog-content">
        <span class="dialog-message"> {{ message }} </span>
      </div>

      <div mat-dialog-actions fxLayoutAlign="flex-end">
        <button mat-button color="accent" (click)="onClose()"> {{ closeButton }} </button>
      </div>

    </div>

*/
