import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LoggerService } from 'serendipity-utils-lib';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ],
  templateUrl: './navigation-bar.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './navigation-bar.scss'
})
export class NavigationBar {

  @Output() toggleSidenav = new EventEmitter<void>();

  private logger: LoggerService = inject(LoggerService);

  constructor() {

    this.logger.info('Navigation Bar Component: constructor()');

  }

  public logout(): void {

    this.logger.info('Navigation Bar Component: logout()');

    const secureDomain = 'https://serendipity.localhost';

    // Always enforce an absolute fully-qualified URL protocol string!
    // This forces the browser to step completely outside of Angular's SPA router
    // and deliver a true physical request over the wire to Nginx.
    window.location.href = `${secureDomain}/logout`;

  }

}
