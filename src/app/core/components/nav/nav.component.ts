import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { MatSidenav } from '@angular/material';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'auth';

import { SidenavService } from 'serendipity-components';
import { MockDashboardService, ToolPaletteItem } from 'dashboard';

import { ConfigService, LoggerService } from 'utils';

interface SideNavRoute {
  icon?: string;
  route?: string;
  title?: string;
}

const MY_WORK_ROUTES = 'my-work-routes';
const CUSTOMER_ROUTES = 'customer-routes';
const SALES_ROUTES = 'sales-routes';
const COLLATERAL_ROUTES = 'collateral-routes';
const TOOLS_ROUTES = 'tools-routes';

@Component({
  selector: 'crm-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  @ViewChild('commandbarSidenav', {static: true})
  public sidenav: MatSidenav;

  public myWorkRoutes: SideNavRoute[];
  public customerRoutes: SideNavRoute[];
  public salesRoutes: SideNavRoute[];
  public collateralRoutes: SideNavRoute[];
  public toolsRoutes: SideNavRoute[];

  public toolPaletteItems: ToolPaletteItem[];

  protected subscription: Subscription;

  constructor(private authService: AuthService,
              private commandBarSidenavService: SidenavService,
              private configService: ConfigService,
              private dashboardService: MockDashboardService,
              private logger: LoggerService,
              private translate: TranslateService) {}

  public ngOnInit(): void {

    this.logger.info('NavComponent: ngOnInit()');

    this.commandBarSidenavService.setSidenav(this.sidenav);

    this.loadNavListItems();

    this.subscribe();
  }

  async loadNavListItems() {

    this.myWorkRoutes = await this.configService.get(MY_WORK_ROUTES);

    this.myWorkRoutes.forEach(route => {

      this.translate.get(route.title).subscribe(value => {
        route.title = value;
      });

    });

    this.customerRoutes = await this.configService.get(CUSTOMER_ROUTES);

    this.customerRoutes.forEach(route => {

      this.translate.get(route.title).subscribe(value => {
        route.title = value;
      });

    });

    this.salesRoutes = await this.configService.get(SALES_ROUTES);

    this.salesRoutes.forEach(route => {

      this.translate.get(route.title).subscribe(value => {
        route.title = value;
      });

    });

    this.collateralRoutes = await this.configService.get(COLLATERAL_ROUTES);

    this.collateralRoutes.forEach(route => {

      this.translate.get(route.title).subscribe(value => {
        route.title = value;
      });

    });

    this.toolsRoutes = await this.configService.get(TOOLS_ROUTES);

    this.toolsRoutes.forEach(route => {

      this.translate.get(route.title).subscribe(value => {
        route.title = value;
      });

    });

  }

  protected subscribe() {

    this.logger.info('NavComponent: subscribe()');

    this.subscription = this.dashboardService.getToolPaletteItems().subscribe(data => {
      this.toolPaletteItems = data;
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

// this.logger.info('toolPaletteItems: ' + JSON.stringify(this.toolPaletteItems));
