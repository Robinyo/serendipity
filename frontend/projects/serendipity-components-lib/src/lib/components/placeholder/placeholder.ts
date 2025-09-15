import { Component } from '@angular/core';

import { ActivityBar } from '../activity-bar/activity-bar';
import { CommandBar } from '../command-bar/command-bar';

@Component({
  selector: 'placeholder',
  imports: [
    ActivityBar,
    CommandBar
  ],
  templateUrl: './placeholder.html',
  standalone: true
})
export class Placeholder {

}
