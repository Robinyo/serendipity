import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DragDropModule } from '@angular/cdk/drag-drop';

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
import { FunnelChartComponent, ParliamentChartComponent, PieChartComponent } from 'dashboard-widgets';
import { TimelineComponent } from 'dashboard-widgets';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    // DragDropModule,
    DashboardWidgetsModule,
    DynamicModule.withComponents([ FunnelChartComponent, ParliamentChartComponent, PieChartComponent, TimelineComponent ]),
    FlexLayoutModule,
    GridsterModule,
    SerendipityComponentsModule,
    UtilsModule
  ],
  declarations: [ DashboardComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ DashboardComponent ],
  entryComponents: [ FunnelChartComponent, ParliamentChartComponent, PieChartComponent, TimelineComponent ]
})
export class DashboardModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Module initialised');
  }

}
