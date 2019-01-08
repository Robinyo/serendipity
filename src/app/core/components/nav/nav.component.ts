import { Component } from '@angular/core';

import { AuthService } from 'auth';

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
export class NavComponent {

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

  constructor(private authService: AuthService) {}

  public isAuthenticated() {
    return this.authService.isAuthenticated();
  }

}

