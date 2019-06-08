import { Component, Input, OnInit } from '@angular/core';

import { DashboardConfig, DashboardItem } from '../../models/models';

import { LoggerService } from 'utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard',
  template: `
    <gridster [options]="options">

      <gridster-item [item]="item" *ngFor="let item of items">

        <p>{{item.name}}</p>

      </gridster-item>

    </gridster>
  `,
  styles: []
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  @Input() options: DashboardConfig;
  @Input() items: DashboardItem[];

  constructor(private logger: LoggerService) {}

  public ngOnInit() {
    this.logger.info('DashboardComponent: ngOnInit()');
  }

}

/*

  public options: DashboardConfig;
  public items: DashboardItem[] = [];

// import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

*/

// See: https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.constant.ts

