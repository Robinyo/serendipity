import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  template: `

    <div *ngIf="title">
      <h3 mat-dialog-title class="dialog-title"> {{ title }} </h3>
    </div>

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
export class ConfirmDialogComponent {

  public message: string | undefined;
  public title: string | undefined;

  public acceptButton = 'ACCEPT';
  public cancelButton = 'CANCEL';


  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  public onAccept(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
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

      </div>

    </div>

*/
