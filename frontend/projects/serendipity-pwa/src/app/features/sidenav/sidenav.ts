import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { Config } from 'utils-lib';

import { NavigationBar } from '../navigation-bar/navigation-bar';

import { SidenavRoute } from './sidenav-route';

const MY_WORK_ROUTES = 'my-work-routes';
const CUSTOMER_ROUTES = 'customers-routes';
// const SALES_ROUTES = 'sales-routes';
// const COLLATERAL_ROUTES = 'collateral-routes';
// const MARKETING_ROUTES = 'marketing-routes';
const TOOLS_ROUTES = 'tools-routes';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatIconModule,
    MatListModule,
    MatSidenavModule,

    NavigationBar,

    RouterOutlet,
    RouterLink
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav implements OnInit  {

  private config = inject(Config);

  public myWorkRoutes: SidenavRoute[] | undefined;
  public customerRoutes: SidenavRoute[] | undefined;
  // public salesRoutes: SidenavRoute[] | undefined;
  // public collateralRoutes: SidenavRoute[] | undefined;
  // public marketingRoutes: SidenavRoute[] | undefined;
  public toolsRoutes: SidenavRoute[] | undefined;

  ngOnInit(): void {
    this.loadNavListItems();
  }

  loadNavListItems() {

    this.config.get(MY_WORK_ROUTES).subscribe(data => {
      this.myWorkRoutes = data;
    });

    this.config.get(CUSTOMER_ROUTES).subscribe(data => {
      this.customerRoutes = data;
    });

    this.config.get(TOOLS_ROUTES).subscribe(data => {
      this.toolsRoutes = data;
    });

  }

}
