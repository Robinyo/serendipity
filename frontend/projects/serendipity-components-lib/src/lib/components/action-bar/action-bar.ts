import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'action-bar',
  imports: [
    MatToolbar,
    MatToolbarRow
  ],
  template: `
    <mat-toolbar class="action-bar">

      <mat-toolbar-row>

        <ng-content> </ng-content>

      </mat-toolbar-row>

    </mat-toolbar>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './action-bar.scss'
})
export class ActionBar {

}
