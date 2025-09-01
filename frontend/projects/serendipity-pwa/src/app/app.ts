import { Component, signal } from '@angular/core';

import { Sidenav } from './features/sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [
    Sidenav
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Serendipity PWA');
}
