import { Component } from '@angular/core';

import { Layout } from './features/layout/layout';

@Component({
  selector: 'app-root',
  imports: [
    Layout
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}

/*

import { loggerProviders } from 'serendipity-utils-lib';

  providers: [
    loggerProviders
  ],

*/
