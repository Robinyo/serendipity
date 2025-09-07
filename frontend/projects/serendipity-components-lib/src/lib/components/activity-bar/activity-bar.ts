import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'activity-bar',
  imports: [
    MatToolbar,
    MatToolbarRow
  ],
  templateUrl: './activity-bar.html',
  styleUrl: './activity-bar.scss'
})
export class ActivityBar {

}
