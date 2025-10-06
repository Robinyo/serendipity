import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";

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
    RouterLink
  ],
  templateUrl: './layout.html',
  standalone: true,
  styleUrl: './layout.scss'
})
export class Layout  implements OnInit  {

  public myWorkRoutes: SidenavRoute[] | undefined;
  public customerRoutes: SidenavRoute[] | undefined;
  // public salesRoutes: SidenavRoute[] | undefined;
  // public collateralRoutes: SidenavRoute[] | undefined;
  // public marketingRoutes: SidenavRoute[] | undefined;
  public toolsRoutes: SidenavRoute[] | undefined;

  private configService = inject(ConfigService);

  ngOnInit(): void {
    this.loadNavListItems();
  }

  loadNavListItems() {

    // The JSON configuration files are in the /src/assets/data/config directory

    this.configService.get(MY_WORK_ROUTES).subscribe(data => {
      this.myWorkRoutes = data;
    });

    this.configService.get(CUSTOMER_ROUTES).subscribe(data => {
      this.customerRoutes = data;
    });

    this.configService.get(TOOLS_ROUTES).subscribe(data => {
      this.toolsRoutes = data;
    });

  }

}
