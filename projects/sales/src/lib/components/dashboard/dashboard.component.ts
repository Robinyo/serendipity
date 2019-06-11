import { Component, OnInit } from '@angular/core';

// import { DashboardConfig, DashboardItem } from 'dashboard';
import { DashboardItem } from 'dashboard';

import * as screenfull from 'screenfull';
import {Screenfull} from 'screenfull';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // public options: DashboardConfig;
  public items: DashboardItem[] = [];

  constructor(private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('DashboardComponent: ngOnInit()');

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

    // Y increases downwards, X increases to the right :)

    this.items = [
      { x: 0, y: 0, rows: 4, cols: 3, name: 'Open Opportunities', component: 'funnelChart'},
      { x: 3, y: 0, rows: 4, cols: 3, name: 'All Opportunities', component: 'pieChart'}
    ];

  }

  //
  // Command Bar events
  //

  public onFullscreen() {

    this.logger.info('DashboardComponent: onFullscreen()');

    const sf = <Screenfull>screenfull;

    if (sf.enabled) {
      sf.toggle();
    }

  }

}

// https://github.com/sindresorhus/screenfull.js/issues/126

/*

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
