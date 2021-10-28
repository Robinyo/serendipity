import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss' ],
})
export class LoadingDialogComponent {

  // public title =  'Loading data';
  // public message = 'Please wait while we access your data';

  constructor(private dialogRef: MatDialogRef<LoadingDialogComponent>) {}

}
