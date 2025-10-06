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

    providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]

  import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'} }
  ],

*/
