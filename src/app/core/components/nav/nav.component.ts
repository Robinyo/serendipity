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

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  @ViewChild('commandbarSidenav', {static: true})
  public sidenav: MatSidenav;

  public myWorkRoutes: SideNavRoute[];
  public customerRoutes: SideNavRoute[];

  public toolPaletteItems: ToolPaletteItem[];

  protected subscription: Subscription;

  constructor(private commandBarSidenavService: SidenavService,
              private dashboardService: MockDashboardService,
              private authService: AuthService,
              private configService: ConfigService,
              private translate: TranslateService,
              private logger: LoggerService) {}

  public ngOnInit(): void {

    this.logger.info('NavComponent: ngOnInit()');

    this.commandBarSidenavService.setSidenav(this.sidenav);

    this.loadNavListItems();

    this.subscribe();
  }

  async loadNavListItems() {

    this.myWorkRoutes = await this.configService.get('my-work-routes');

    this.myWorkRoutes.forEach(route => {

      this.translate.get(route.title).subscribe(value => {
        route.title = value;
      });

    });

    this.customerRoutes = await this.configService.get('customer-routes');

    this.customerRoutes.forEach(route => {

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
