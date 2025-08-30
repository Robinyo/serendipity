import { Component, signal } from '@angular/core';

import { NavigationBar } from './features/navigation-bar/navigation-bar';
import { Sidenav } from './features/sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [
    NavigationBar,
    Sidenav
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Serendipity PWA');
}
