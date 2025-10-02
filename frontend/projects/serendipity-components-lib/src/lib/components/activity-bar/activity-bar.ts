import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'activity-bar',
  imports: [
    MatToolbar,
    MatToolbarRow
  ],
  template: `
    <mat-toolbar class="activity-bar">

      <mat-toolbar-row class="activity-bar-row">

        <ng-content> </ng-content>

      </mat-toolbar-row>

    </mat-toolbar>
  `,
  standalone: true,
  styleUrl: './activity-bar.scss'
})
export class ActivityBar {

}
