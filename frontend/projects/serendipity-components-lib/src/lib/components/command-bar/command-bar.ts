import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'command-bar',
  imports: [
    MatToolbar,
    MatToolbarRow
  ],
  template: `
    <mat-toolbar class="command-bar">

      <ng-content> </ng-content>

    </mat-toolbar>
  `,
  standalone: true,
  styleUrl: './command-bar.scss'
})
export class CommandBar {

}
