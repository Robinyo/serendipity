import { Component, Input, OnInit } from '@angular/core';

import { NumberCardComponent } from 'dashboard-widgets';

import { DashboardConfig, DashboardItem } from '../../models/models';

import { LoggerService } from 'utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard',
  template: `
    <gridster [options]="options">

      <gridster-item *ngFor="let item of items" [item]="item">

        <ndc-dynamic [ndcDynamicComponent]=component></ndc-dynamic>

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

  component = NumberCardComponent;

  constructor(private logger: LoggerService) {}

  public ngOnInit() {
    this.logger.info('DashboardComponent: ngOnInit()');
  }

}

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

