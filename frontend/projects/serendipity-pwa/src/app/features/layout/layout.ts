import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ConfigService } from 'serendipity-utils-lib';

import { NavigationBar } from '../navigation-bar/navigation-bar';
import { SidenavRoute } from './sidenav-route';

import { CUSTOMER_ROUTES, MY_WORK_ROUTES, TOOLS_ROUTES } from './constants';


@Component({
  selector: 'app-layout',
  imports: [
    MatIconModule,
    MatListModule,
    MatSidenavModule,

    NavigationBar,

    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './layout.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './layout.scss'
})
export class Layout {

  public myWorkRoutes: ReadonlyArray<SidenavRoute> = [];
  public customerRoutes: ReadonlyArray<SidenavRoute> = [];
  public toolsRoutes: ReadonlyArray<SidenavRoute> = [];

  private configService = inject(ConfigService);

  constructor() {
    this.loadNavListItems();
  }

  private loadNavListItems(): void {

    // The JSON configuration files are in the /src/assets/data/config directory

    this.configService.get(MY_WORK_ROUTES).pipe(
      takeUntilDestroyed(),
      filter((data): data is unknown[] => Array.isArray(data))
    ).subscribe(data => {
      this.myWorkRoutes = data as ReadonlyArray<SidenavRoute>;
    });

    this.configService.get(CUSTOMER_ROUTES).pipe(
      takeUntilDestroyed(),
      filter((data): data is unknown[] => Array.isArray(data))
    ).subscribe(data => {
      this.customerRoutes = data as ReadonlyArray<SidenavRoute>;
    });

    this.configService.get(TOOLS_ROUTES).pipe(
      takeUntilDestroyed(),
      filter((data): data is unknown[] => Array.isArray(data))
    ).subscribe(data => {
      this.toolsRoutes = data as ReadonlyArray<SidenavRoute>;
    });

  }

}
