import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { DynamicModule } from 'ng-dynamic-component';

import { GridsterModule } from 'angular-gridster2';

import { DashboardWidgetsModule } from 'dashboard-widgets';
import { FunnelChartComponent, ParliamentChartComponent, PieChartComponent, TimelineComponent } from 'dashboard-widgets';
import { SerendipityComponentsModule } from 'serendipity-components';
import { AngularMaterialModule, UtilsModule, LoggerService } from 'utils';

import { DashboardComponent } from './components/dashboard/dashboard.component';

const dashboardWidgets = [
  FunnelChartComponent,
  ParliamentChartComponent,
  PieChartComponent,
  TimelineComponent
];

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DashboardWidgetsModule,
    DynamicModule,
    FlexLayoutModule,
    GridsterModule,
    SerendipityComponentsModule,
    UtilsModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
  entryComponents: [
    ...dashboardWidgets
  ]
})
export class DashboardModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Dashboard Module initialised');
  }

}

/*

    DynamicModule.withComponents(
      dashboardWidgets
    ),

*/
