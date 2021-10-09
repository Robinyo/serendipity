import { Component,  EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";

import { MatIconRegistry } from "@angular/material/icon";

import { AuthService } from 'auth-bff-lib';
import { LoggerService } from 'utils-lib';

import { SVG_ICONS } from './svg-icons';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private authService: AuthService,
              private logger: LoggerService) {

    const svgIconPath = '../assets/images/icons/navigation-bar/';

    SVG_ICONS.forEach(svgIcon => {

      if (svgIcon.name != undefined && svgIcon.filename != undefined) {

        this.matIconRegistry.addSvgIcon(
          svgIcon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(svgIconPath + svgIcon.filename)
        );

      }
    });

  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public login() {
    this.authService.loginWithRedirect();
  }

  public logout() {
    this.authService.logout("/");
  }

}

/*

  public login() {

    this.logger.info('NavigationBarComponent: login()');

    const subscription: Subscription = this.authService.login().subscribe(response => {

      // this.logger.info('response: ' + JSON.stringify(response, null, 2));

      subscription.unsubscribe();

      // this.authenticated = !this.authenticated

      window.location = response.authorizationRequestUrl;

    });

  }

  public logout() {

    this.logger.info('NavigationBarComponent: logout()');

    // this.authenticated = !this.authenticated

    this.router.navigate(['/']);
  }

*/
