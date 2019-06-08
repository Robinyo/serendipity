// import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

// import { ContactsService } from '../../services/contacts/contacts.service';
import { DashboardItem } from '../../shared/dashboard.models';

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
  // public items: Array<GridsterItem>;
  public items: DashboardItem[] = [];

  constructor(private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('DashboardComponent: ngOnInit()');

    // See: https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.constant.ts

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

    this.items = [
      {cols: 1, rows: 1, y: 0, x: 0, name: 'Accounts' },
      {cols: 2, rows: 2, y: 2, x: 0, name: 'Opportunities' },
      {cols: 1, rows: 1, y: 0, x: 1, name: 'Contacts' },
      {cols: 2, rows: 2, y: 2, x: 0, name: 'Leads' },
    ];

  }

}

/*

Open Leads
Open Opportunities
Sales Leaderboard
Opportunity by Status
Opportunity Pipeline by Sales Stage

number-card
bar-horizontal

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
