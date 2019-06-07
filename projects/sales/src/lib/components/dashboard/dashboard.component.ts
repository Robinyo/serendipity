// import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  public options: GridsterConfig;
  public items: Array<GridsterItem>;

  constructor(private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('DashboardComponent: ngOnInit()');

    // See: https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.constant.ts

    this.options = {
      // itemChangeCallback: LayoutComponent.itemChange,
      // itemResizeCallback: LayoutComponent.itemResize,
      minCols: 6,
      maxCols: 12,
      minRows: 8,
      maxRows: 12,
      draggable: {
        enabled: true
      },
      pushItems: true,
      resizable: {
        enabled: true
      }
    };

    this.items = [
      {cols: 2, rows: 2, y: 0, x: 0},

      {cols: 2, rows: 1, y: 0, x: 2},
      {cols: 2, rows: 1, y: 1, x: 2},

      {cols: 2, rows: 1, y: 0, x: 4},
      {cols: 2, rows: 1, y: 1, x: 4}
    ];

  }

}

/*

    this.items = [
      {cols: 1, rows: 1, y: 0, x: 0},
      {cols: 1, rows: 1, y: 0, x: 1}
    ];

*/
