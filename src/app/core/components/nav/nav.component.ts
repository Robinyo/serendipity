import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSidenav } from '@angular/material';

import { SidenavService } from 'serendipity-components';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}

/*
interface WIDGET {
  id?: string;
  icon?: string;
}
*/

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @ViewChild('commandbarSidenav') public sidenav: MatSidenav;

  public icon = '../../../../assets/images/icons/bar-chart.svg';
  public title = 'New Chart';

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

  constructor(private commandBarSidenavService: SidenavService,
              private authService: AuthService,
              private logger: LoggerService) {}

  public ngOnInit(): void {

    this.logger.info('NavComponent: ngOnInit()');

    this.commandBarSidenavService.setSidenav(this.sidenav);
  }

  public isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  public onDragStart(event, identifier) {

    this.logger.info('NavComponent: onDragStart()');

    event.dataTransfer.setData('widgetIdentifier', identifier);

    event.dataTransfer.setData('text/plain', 'Drag Me Button');
    event.dataTransfer.dropEffect = 'copy';
  }

}

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.html
// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.ts
