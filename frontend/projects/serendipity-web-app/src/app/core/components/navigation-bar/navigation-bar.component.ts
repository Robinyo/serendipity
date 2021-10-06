import { Component,  EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import { MatIconRegistry } from "@angular/material/icon";

import { LoggerService } from 'utils-lib';


interface SvgIconRegistry {
  name?: string;
  filename?: string;
}

const svgIcons: SvgIconRegistry[] = [

  {
    "name":  "help-white",
    "filename": "help_outline_white_24dp.svg"
  },
  {
    "name":  "login",
    "filename": "login_black_24dp.svg"
  },
  {
    "name":  "logout",
    "filename": "logout_black_24dp.svg"
  },
  {
    "name":  "menu-white",
    "filename": "menu_white_24dp.svg"
  },
  {
    "name":  "person",
    "filename": "person_black_24dp.svg"
  },
  {
    "name":  "person-white",
    "filename": "person_white_24dp.svg"
  },
  {
    "name":  "settings-white",
    "filename": "settings_white_24dp.svg"
  }

];

const svgIconPath = '../assets/images/svg/';

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

    svgIcons.forEach(svgIcon => {

      if (svgIcon.name != undefined && svgIcon.filename != undefined) {

        this.matIconRegistry.addSvgIcon(
          svgIcon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/svg/' + svgIcon.filename)
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
