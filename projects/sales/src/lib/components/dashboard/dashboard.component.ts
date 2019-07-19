import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { SidenavService } from 'serendipity-components';

import { DashboardWidgetService } from 'dashboard-widgets';

import { Dashboard, MockDashboardService } from 'dashboard';

import { LoggerService } from 'utils';

import * as screenfull from 'screenfull';
import { Screenfull } from 'screenfull';

@Component({
  selector: 'sales-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public dashboardId = '1';
  public dashboardName = 'Sample Dashboard 1';

  public items: Dashboard[];

  public screenFull = <Screenfull>screenfull;

  protected subscription: Subscription;

  constructor(private commandBarSidenavService: SidenavService,
              private dashboardService: MockDashboardService,
              private dashboardWidgetService: DashboardWidgetService,
              private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('Sales DashboardComponent: ngOnInit()');

    if (this.screenFull.enabled) {

      this.logger.info('Sales DashboardComponent: Screenfull change handler registered');

      this.screenFull.on('change', () => {

        if (this.screenFull.isFullscreen) {
          this.logger.info('Am I fullscreen? Yes');
        } else {
          this.logger.info('Am I fullscreen? No');
        }

        window.dispatchEvent(new Event('resize'));

        setTimeout(() => {
          this.dashboardWidgetService.reflowWidgets();
        }, 750);
      });
    }

    this.subscribe();

  }

  protected subscribe() {

    this.logger.info('Sales DashboardComponent: subscribe()');

    this.subscription = this.dashboardService.getDashboards().subscribe(data => {

      this.items = data;
      // this.logger.info('Sales Dashboards: ' + JSON.stringify(this.items));

    });
  }

  protected unsubscribe() {

    this.logger.info('Sales DashboardComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngOnDestroy() {

    this.logger.info('Sales DashboardComponent: ngOnDestroy()');

    this.unsubscribe();
  }

  //
  // Command Bar events
  //

  public onToggleSidenav() {

    this.logger.info('Sales DashboardComponent: onToggleSidenav()');

    this.commandBarSidenavService.toggle().then(() => {

      if (this.commandBarSidenavService.isOpen()) {
        this.logger.info('commandBarSidenav is open');
      } else {
        this.logger.info('commandBarSidenav is closed');
      }

      // this.gridster.resize();
      window.dispatchEvent(new Event('resize'));

      setTimeout(() => {
        this.dashboardWidgetService.reflowWidgets();
      }, 500);
    });

  }

  /*
  public onToggleSidenav() {

    this.logger.info('Sales DashboardComponent: onToggleSidenav()');

    this.commandBarSidenavService.toggle();

    if (this.commandBarSidenavService.isOpen()) {
      this.logger.info('commandBarSidenav is open');
    } else {
      this.logger.info('commandBarSidenav is closed');
    }

    window.dispatchEvent(new Event('resize'));
  }
  */

  public onFullscreen() {

    this.logger.info('Sales DashboardComponent: onFullscreen()');

    if (this.screenFull.enabled) {
      this.screenFull.toggle();
    }

  }

  //
  // Activity Bar events
  //

  public onMenuClick(item: Dashboard) {

    this.logger.info('Sales DashboardComponent: onMenuClick()');

    this.dashboardId = item.id;
    this.dashboardName = item.name;

    // this.logger.info('Sales Dashboard Id: ' + this.dashboardId);
  }

}

// https://github.com/sindresorhus/screenfull.js/issues/126

/*

import {
  COMMAND_BAR_SIDENAV_WIDTH
} from '../../models/constants';

  @ViewChild('contentContainer')
  private contentContainerElementRef: ElementRef;

  public containerWidth: number;
  public dashboardWidth: number;


    this.containerWidth = this.contentContainerElementRef.nativeElement.offsetWidth;

    this.logger.info('containerWidth: ' + this.containerWidth);

  // (window:resize)="onResize($event)
  public onResize(event) {

    this.containerWidth = event.target.innerWidth;
    this.logger.info('containerWidth: ' + this.containerWidth);

  }

  public onToggleSidenav() {

    this.logger.info('Sales DashboardComponent: onToggleSidenav()');

    this.commandBarSidenavService.toggle();

    if (this.commandBarSidenavService.isOpen()) {

      this.logger.info('commandBarSidenav is open');
      this.dashboardWidth = this.containerWidth - COMMAND_BAR_SIDENAV_WIDTH;
      this.logger.info('dashboardWidth: ' + this.dashboardWidth);

    } else {

      this.logger.info('commandBarSidenav is closed');
      this.dashboardWidth = this.containerWidth;
      this.logger.info('dashboardWidth: ' + this.dashboardWidth);

    }

    window.dispatchEvent(new Event('resize'));
  }


*/

/*
setTimeout(() => {
  this.dashboardWidgetService.reflowWidgets();
}, 1000);
*/


/*

    // Y increases downwards, X increases to the right :)

    this.items = [
      { x: 0, y: 0, rows: 4, cols: 3, name: 'Open Opportunities', component: 'funnelChart'},
      { x: 3, y: 0, rows: 4, cols: 3, name: 'All Opportunities', component: 'pieChart'}
    ];

    const sf = <Screenfull>screenfull;

    if (sf.enabled) {

      sf.toggle();

      setTimeout(() => {
        this.dashboardWidgetService.reflowWidgets();
      }, 1000);

    }

    this.items = [
      { x: 0, y: 0, rows: 2, cols: 2, name: 'Accounts' },
      { x: 2, y: 0, rows: 2, cols: 2, name: 'Contacts' }
    ];

      {cols: 1, rows: 1, y: 0, x: 0, name: 'Accounts' },
      {cols: 2, rows: 2, y: 2, x: 0, name: 'Opportunities' },
      {cols: 1, rows: 1, y: 0, x: 1, name: 'Contacts' },
      {cols: 2, rows: 2, y: 2, x: 0, name: 'Leads' },

Open Leads
Open Opportunities
Sales Leaderboard
Opportunity by Status
Opportunity Pipeline by Sales Stage

number-card
bar-horizontal

  // public options: GridsterConfig;
  // public items: Array<GridsterItem>;

  public items: Array<GridsterItem>;

    this.items = [
      {cols: 2, rows: 2, y: 0, x: 0},

      {cols: 2, rows: 1, y: 0, x: 2},
      {cols: 2, rows: 1, y: 1, x: 2},

      {cols: 2, rows: 1, y: 0, x: 4},
      {cols: 2, rows: 1, y: 1, x: 4}
    ];

    this.items = [
      {cols: 1, rows: 1, y: 0, x: 0},
      {cols: 1, rows: 1, y: 0, x: 1}
    ];

*/

/*
this.options = {
  // itemChangeCallback: LayoutComponent.itemChange,
  // itemResizeCallback: LayoutComponent.itemResize,
  minCols: 4,
  maxCols: 4,
  minRows: 4,
  maxRows: 4,
  draggable: {
    enabled: true
  },
  pushItems: true,
  resizable: {
    enabled: true
  }
};
*/
