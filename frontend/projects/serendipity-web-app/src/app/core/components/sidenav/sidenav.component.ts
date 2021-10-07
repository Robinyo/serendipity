import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

import { ConfigService, LoggerService } from 'utils-lib';

import { SidenavRoute } from "@app/core/models/models";

import { SVG_ICONS } from './svg-icons';

const MY_WORK_ROUTES = 'my-work-routes';
const CUSTOMER_ROUTES = 'customers-routes';
// const SALES_ROUTES = 'sales-routes';
// const COLLATERAL_ROUTES = 'collateral-routes';
// const MARKETING_ROUTES = 'marketing-routes';
const TOOLS_ROUTES = 'tools-routes';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  public myWorkRoutes: SidenavRoute[] | undefined;
  public customerRoutes: SidenavRoute[] | undefined;
  // public salesRoutes: SidenavRoute[] | undefined;
  // public collateralRoutes: SidenavRoute[] | undefined;
  // public marketingRoutes: SidenavRoute[] | undefined;
  public toolsRoutes: SidenavRoute[] | undefined;

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private configService: ConfigService,
              private logger: LoggerService) {

    const svgIconPath = '../assets/images/icons/sidenav/';

    SVG_ICONS.forEach(svgIcon => {

      if (svgIcon.name != undefined && svgIcon.filename != undefined) {

        this.matIconRegistry.addSvgIcon(
          svgIcon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(svgIconPath + svgIcon.filename)
        );

      }
    });

  }

  ngOnInit(): void {

    // this.logger.info('SidenavComponent: ngOnInit()');

    this.loadNavListItems();
  }

  async loadNavListItems() {

    this.myWorkRoutes = await this.configService.get(MY_WORK_ROUTES);

    this.customerRoutes = await this.configService.get(CUSTOMER_ROUTES);

    this.toolsRoutes = await this.configService.get(TOOLS_ROUTES);

  }

}

/*

    this.myWorkRoutes.forEach(route => {

      // const id = route.title;
      const id = 'NAVIGATION_BAR_TITLE';
      const translation = $localize(<any>{ '0': `:@@${id}:${id}`, 'raw': [':'] });

      route.title = translation;

      this.logger.info('translation: ' + translation);
    });

*/
