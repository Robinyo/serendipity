import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ActivityBar } from '../activity-bar/activity-bar';
import { CommandBar } from '../command-bar/command-bar';

@Component({
  selector: 'placeholder',
  imports: [
    ActivityBar,
    CommandBar
  ],
  templateUrl: './placeholder.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class Placeholder {

}
