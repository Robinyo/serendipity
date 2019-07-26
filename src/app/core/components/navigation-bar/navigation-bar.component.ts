import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({
  selector: 'crm-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  private returnUrl = '/';

  constructor(private authService: AuthService,
              private router: Router,
              private logger: LoggerService) {

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {

        this.returnUrl = event.url;

        this.logger.info('NavigationBarComponent returnUrl: ' + this.returnUrl);
      }

    });

  }

  public logout() {

    this.authService.logout(this.returnUrl || '/');
  }

}
