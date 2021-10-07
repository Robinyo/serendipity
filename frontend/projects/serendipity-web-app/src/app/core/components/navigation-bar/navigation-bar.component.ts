import { Component,  EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

import { LoggerService } from 'utils-lib';

import { SVG_ICONS } from './svg-icons';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  private authenticated = false;

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
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
    return this.authenticated;
  }

  public login() {

    this.logger.info('NavigationBarComponent: login()');

    this.authenticated = !this.authenticated
  }

  public logout() {

    this.logger.info('NavigationBarComponent: logout()');

    this.authenticated = !this.authenticated
  }

}
