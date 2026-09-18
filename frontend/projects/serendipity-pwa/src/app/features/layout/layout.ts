import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

import { rxResource } from '@angular/core/rxjs-interop';

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

  private configService = inject(ConfigService);

  readonly myWorkRoutes = rxResource({
    defaultValue: [] as SidenavRoute[],
    stream: () => this.configService.get<SidenavRoute[]>(MY_WORK_ROUTES),
  });

  readonly customerRoutes = rxResource({
    defaultValue: [] as SidenavRoute[],
    stream: () => this.configService.get<SidenavRoute[]>(CUSTOMER_ROUTES),
  });

  readonly toolsRoutes = rxResource({
    defaultValue: [] as SidenavRoute[],
    stream: () => this.configService.get<SidenavRoute[]>(TOOLS_ROUTES),
  });

}
