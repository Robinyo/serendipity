import { Component } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import { MatIconRegistry } from "@angular/material/icon";

import { AuthService } from 'auth-bff-lib';
import { LoggerService } from 'utils-lib';

import { SVG_ICONS } from './svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private authService: AuthService,
              private logger: LoggerService) {

    // this.logger.info('HomeComponent: ngOnInit()');

    const svgIconPath = '../assets/images/icons/misc/';

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

}
