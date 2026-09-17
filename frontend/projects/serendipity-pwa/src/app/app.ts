import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Layout } from './features/layout/layout';

@Component({
  selector: 'app-root',
  imports: [
    Layout
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss'
})
export class App {
}
