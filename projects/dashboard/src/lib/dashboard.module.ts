import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { GridsterModule } from 'angular-gridster2';

import { DashboardComponent } from './components/dashboard/dashboard.component';

//
// Serendipity Components lib
//

import { SerendipityComponentsModule } from 'serendipity-components';

//
// Dashboard Widgets lib
//

import { DynamicModule } from 'ng-dynamic-component';
import { DashboardWidgetsModule } from 'dashboard-widgets';
import { FunnelChartComponent, ParliamentChartComponent, PieChartComponent, TimelineComponent } from 'dashboard-widgets';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

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
