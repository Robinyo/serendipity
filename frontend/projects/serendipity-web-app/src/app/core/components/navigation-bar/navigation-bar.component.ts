import { Component, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import { MatIconRegistry } from "@angular/material/icon";

import { AuthService } from 'auth-lib';
import { ErrorService, LoggerService } from 'utils-lib';

import { SVG_ICONS } from './svg-icons';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private domSanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry,
              private authService: AuthService,
              private errorService: ErrorService,
              private logger: LoggerService) {

    // this.logger.info('NavigationBarComponent: constructor()');

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

    // window.location.href = "http://127.0.0.1:8080/oauth2/authorization/keycloak";
  }

  public logout() {
    this.authService.logoutWithRedirect("/");
  }

  public help() {
    this.errorService.get('401', '4000');
  }

  public settings() {
    this.errorService.get('404', '6000');
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
