import { Component, signal } from '@angular/core';

import { loggerProviders } from 'serendipity-utils-lib';

import { Layout } from './features/layout/layout';

@Component({
  selector: 'app-root',
  imports: [
    Layout
  ],
  providers: [
    loggerProviders
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // protected readonly title = signal('Serendipity PWA');
}
