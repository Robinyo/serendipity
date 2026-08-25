import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ActivityBar } from '../activity-bar/activity-bar.js';
// import { CommandBar } from '../command-bar/command-bar';

@Component({
  selector: 'placeholder',
  imports: [
    ActivityBar
  ],
  templateUrl: './placeholder.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class Placeholder {

}
