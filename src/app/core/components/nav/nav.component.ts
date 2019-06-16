import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatSidenav } from '@angular/material';

import { SidenavService } from 'serendipity-components';

import { MockDashboardService, ToolPaletteItem } from 'dashboard';
import { Subscription } from 'rxjs';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  @ViewChild('commandbarSidenav') public sidenav: MatSidenav;

  myWorkRoutes: ROUTE[] = [
    {
      icon: 'assignment',
      route: 'sales/activities',
      title: 'Activities',
    }, {
      icon: 'dashboard',
      route: 'sales/dashboards',
      title: 'Dashboards',
    }
  ];

  customerRoutes: ROUTE[] = [
    {
      icon: 'contacts',
      route: 'sales/accounts',
      title: 'Accounts',
    }, {
      icon: 'people',
      route: 'sales/contacts',
      title: 'Contacts',
    }, {
      icon: 'settings_phone',
      route: 'sales/leads',
      title: 'Leads',
    }, {
      icon: 'account_box',
      route: 'sales/opportunities',
      title: 'Opportunities',
    }
  ];

  public toolPaletteItems: ToolPaletteItem[];

  protected subscription: Subscription;

  constructor(private commandBarSidenavService: SidenavService,
              private dashboardService: MockDashboardService,
              private authService: AuthService,
              private logger: LoggerService) {}

  public ngOnInit(): void {

    this.logger.info('NavComponent: ngOnInit()');

    this.commandBarSidenavService.setSidenav(this.sidenav);

    this.subscribe();
  }

  protected subscribe() {

    this.logger.info('NavComponent: subscribe()');

    this.subscription = this.dashboardService.getToolPaletteItems().subscribe(data => {

      this.toolPaletteItems = data;
      this.logger.info('toolPaletteItems: ' + JSON.stringify(this.toolPaletteItems));
    });

  }

  protected unsubscribe() {

    this.logger.info('DashboardComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  public onDragStart(event, identifier) {

    this.logger.info('NavComponent: onDragStart()');

    event.dataTransfer.setData('widgetIdentifier', identifier);

    event.dataTransfer.setData('text/plain', 'Drag Me Button');
    event.dataTransfer.dropEffect = 'move';
  }

  public ngOnDestroy() {

    this.logger.info('NavComponent: ngOnDestroy()');

    this.unsubscribe();
  }

}

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.html
// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.ts
