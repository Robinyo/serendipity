import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { DashboardConfig, DashboardItemComponentInterface } from '../../models/models';
import { DashboardWidget } from '../../models/models';

import { FunnelChartComponent, PieChartComponent } from 'dashboard-widgets';
import { DashboardWidgetService } from 'dashboard-widgets';

import { SidenavService } from 'serendipity-components';

import { MockDashboardService } from '../../services/mocks/dashboard/mock-dashboard.service';

import { LoggerService } from 'utils';

import * as screenfull from 'screenfull';
import { Screenfull } from 'screenfull';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard',
  template: `
    <gridster [options]="options" (drop)="onDrop($event)" style="background-color: transparent;">

      <ng-container *ngFor="let item of items" style="overflow: hidden;">

        <gridster-item [item]="item">
          <!--
          <ndc-dynamic [ndcDynamicComponent]=item.component></ndc-dynamic>
          -->
          <ndc-dynamic [ndcDynamicComponent]=components[item.component]></ndc-dynamic>
        </gridster-item>

      </ng-container>

    </gridster>
  `,
  styles: []
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  @Input() dashboardId: string;

  public options: DashboardConfig;
  public items: DashboardWidget[];

  public screenFull = <Screenfull>screenfull;

  protected subscription: Subscription;

  public components = {
    funnelChart: FunnelChartComponent,
    pieChart: PieChartComponent
  };

  constructor(private commandBarSidenavService: SidenavService,
              private dashboardService: MockDashboardService,
              private dashboardWidgetService: DashboardWidgetService,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('DashboardComponent: ngOnInit()');

    this.options = {
      itemResizeCallback: this.itemResize.bind(this),
      gridType: 'fit',
      enableEmptyCellDrop: true,
      emptyCellDropCallback: this.onDrop,
      // emptyCellDropCallback: this.onDrop.bind(this),
      pushItems: true,
      swap: true,
      pushDirections: { north: true, east: true, south: true, west: true },
      resizable: { enabled: true },
      itemChangeCallback: this.itemChange.bind(this),
      draggable: {
        enabled: true,
        ignoreContent: true,
        dropOverItems: true,
        dragHandleClass: 'drag-handler',
        ignoreContentClass: 'no-drag',
      },
      // displayGrid: 'always',
      minCols: 10, // 6
      minRows: 10, // 6
      // maxCols: 6,
      // maxRows: 6,
    };

    /*

    if (this.screenFull.enabled) {

      this.logger.info('DashboardComponent: Screenfull change handler registered');

      this.screenFull.on('change', () => {
        if (this.screenFull.isFullscreen) {
          this.logger.info('Am I fullscreen? Yes');
        } else {
          this.logger.info('Am I fullscreen? No');
        }

        // this.dashboardWidgetService.reflowWidgets();
      });
    }

    */

    this.subscribe();

  }

  protected subscribe() {

    this.logger.info('DashboardComponent: subscribe()');

    if (this.dashboardId) {

      this.subscription = this.dashboardService.getDashboard(this.dashboardId).subscribe(data => {
        this.items = data.widgets;

        this.logger.info('Dashboard Id: ' + JSON.stringify(data.id));
        this.logger.info('Widgets: ' + JSON.stringify(this.items));
      });

    }

  }

  public itemResize(item: DashboardWidget, itemComponent: DashboardItemComponentInterface): void {

    this.logger.info('DashboardComponent: itemResize()');

    this.dashboardWidgetService.reflowWidgets();
  }

  public onDrop(event) {

    this.logger.info('DashboardComponent: onDrop()');

    const id = event.dataTransfer.getData('widgetIdentifier');

    this.logger.info('Widget Id: ' + id);

    return this.items.push({
      'id': '9',
      'name': 'All Opportunities',
      'component': 'pieChart',
      'cols': 2,
      'rows': 2,
      'y': 0,
      'x': 0
    });

  }

  public itemChange() {
    this.logger.info('DashboardComponent: itemChange()');
  }

  protected unsubscribe() {

    this.logger.info('DashboardComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngOnDestroy() {

    this.logger.info('DashboardComponent: ngOnDestroy()');

    if (this.commandBarSidenavService.isOpen()) {

      this.logger.info('commandBarSidenav is open');
      this.commandBarSidenavService.toggle();
    }

    this.unsubscribe();
  }

}

// https://github.com/highcharts/highcharts/issues/6427 -> style="overflow: hidden;"

/*

// this.options.api.optionsChanged();

this.logger.info('Am I fullscreen? ' + this.screenFull.isFullscreen ? 'Yes' : 'No');

this.options = {
  itemResizeCallback: this.itemResize.bind(this),
  minCols: 4,
  maxCols: 4,
  minRows: 2,
  maxRows: 2,
  draggable: {
    enabled: true
  },
  pushItems: true,
  resizable: {
    enabled: false
  }
};

*/

/*

  // @Input() options: DashboardConfig;
  // @Input() items: DashboardItem[];

    // this.logger.info('item: ' + JSON.stringify(item));
    // this.logger.info('itemComponent: ' + JSON.stringify(itemComponent.item));

    // this.items[0].rows = item.rows;
    // this.items[0].cols = item.cols;

    this.logger.info('top: ' + itemComponent.top);
    this.logger.info('left: ' + itemComponent.left);

    this.logger.info('width: ' + itemComponent.width);
    this.logger.info('height: ' + itemComponent.height);

*/

// https://github.com/tiberiuzuld/angular-gridster2/issues/389
// https://github.com/tiberiuzuld/angular-gridster2/issues/308

/*

    this.logger.info('width: ' + itemComponent.gridster.curWidth);
    this.logger.info('height: ' + itemComponent.gridster.curHeight);
    this.logger.info('curColWidth: ' + itemComponent.gridster.curColWidth);
    this.logger.info('curRowHeight: ' + itemComponent.gridster.curRowHeight);

        <dashboard-widget [item]="item"> </dashboard-widget>
*/

/*


// this.logger.info('itemComponent: ' + JSON.stringify(itemComponent));

// https://github.com/tiberiuzuld/angular-gridster2/issues/362

(resized)="onResize($event, item)"


  public onResize(event: any, item: DashboardItem) {

    this.logger.info('DashboardComponent: onResize()');

    this.logger.info('item: ' + JSON.stringify(item));
  }

*/

/*

        <div style="display: flex; align-items: stretch; width: 100%; height: 100%;">
          <ndc-dynamic [ndcDynamicComponent]=component></ndc-dynamic>
        </div>

        <div style="width: 100%; height: 100%; background-color: #2196f3;">
          <ndc-dynamic [ndcDynamicComponent]=component></ndc-dynamic>
        </div>

        <div style="width: 100%; height: 100%">
          <ndc-dynamic [ndcDynamicComponent]=component></ndc-dynamic>
        </div>

  <p>{{item.name}}</p>

  <ndc-dynamic class="no-drag" [ndcDynamicComponent]="item.component" (moduleInfo)="display($event)"></ndc-dynamic>

  <ng-content> </ng-content>

  public options: DashboardConfig;
  public items: DashboardItem[] = [];

// import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

*/

// See: https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.constant.ts

