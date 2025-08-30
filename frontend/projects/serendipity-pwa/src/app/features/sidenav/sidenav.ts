import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { Config } from 'utils-lib';

import { SidenavRoute } from './sidenav-route';

const MY_WORK_ROUTES = 'my-work-routes';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav implements OnInit  {

  private config = inject(Config);

  public myWorkRoutes: SidenavRoute[] | undefined;

  ngOnInit(): void {
    this.loadNavListItems();
  }

  loadNavListItems() {

    this.config.get(MY_WORK_ROUTES).subscribe(data => {
      this.myWorkRoutes = data;
    });

  }

}
