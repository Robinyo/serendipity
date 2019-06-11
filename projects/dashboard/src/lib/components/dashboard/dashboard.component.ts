import { Component, Input, OnInit } from '@angular/core';

import { DashboardConfig, DashboardItem, DashboardItemComponentInterface } from '../../models/models';

import { FunnelChartComponent, HighchartsService } from 'dashboard-widgets';

import { LoggerService } from 'utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard',
  template: `
    <gridster [options]="options">

    <!-- <gridster [options]="options" style="background-color: transparent;"> -->

      <ng-container *ngFor="let item of items" style="overflow: hidden;">

        <gridster-item [item]="item">
          <ndc-dynamic [ndcDynamicComponent]=widget></ndc-dynamic>
        </gridster-item>

      </ng-container>

    </gridster>
  `,
  styles: []
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  // @Input() options: DashboardConfig;
  @Input() items: DashboardItem[];

  public options: DashboardConfig;

  widget = FunnelChartComponent;

  constructor(private dashboardWidgetsService: HighchartsService,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('DashboardComponent: ngOnInit()');

    this.options = {
      itemResizeCallback: this.itemResize.bind(this),
      gridType: 'fit',
      // enableEmptyCellDrop: true,
      // emptyCellDropCallback: this.onDrop,
      pushItems: true,
      swap: true,
      pushDirections: { north: true, east: true, south: true, west: true },
      resizable: { enabled: true },
      // itemChangeCallback: this.itemChange.bind(this),
      draggable: {
        enabled: true,
        // ignoreContent: true,
        // dropOverItems: true,
        // dragHandleClass: 'drag-handler',
        // ignoreContentClass: 'no-drag',
      },
      // displayGrid: 'always',
      minCols: 6,
      maxCols: 6,
      minRows: 6,
      maxRows: 6,
    };

    /*

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

  }

  public itemResize(item: DashboardItem, itemComponent: DashboardItemComponentInterface): void {

    this.logger.info('DashboardComponent: itemResize()');

    // this.logger.info('item: ' + JSON.stringify(item));
    // this.logger.info('itemComponent: ' + JSON.stringify(itemComponent.item));

    // this.items[0].rows = item.rows;
    // this.items[0].cols = item.cols;

    this.dashboardWidgetsService.reflowWidgets();
  }

}

// https://github.com/highcharts/highcharts/issues/6427 -> style="overflow: hidden;"

/*

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

