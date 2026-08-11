import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'command-bar',
  imports: [
    MatToolbar
  ],
  template: `
    <mat-toolbar class="command-bar">

      <ng-content> </ng-content>

    </mat-toolbar>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './command-bar.scss'
})
export class CommandBar {

}
