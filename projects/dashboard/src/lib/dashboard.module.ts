import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DragDropModule } from '@angular/cdk/drag-drop';

import { FlexLayoutModule } from '@angular/flex-layout';

import { GridsterModule } from 'angular-gridster2';

import { DashboardComponent } from './components/dashboard/dashboard.component';

//
// Dashboard Widgets lib
//

import { DynamicModule } from 'ng-dynamic-component';
import { DashboardWidgetsModule, FunnelChartComponent, PieChartComponent } from 'dashboard-widgets';

//
// Serendipity Components lib
//

import { SerendipityComponentsModule } from 'serendipity-components';

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
    DynamicModule.withComponents([ FunnelChartComponent, PieChartComponent ]),
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
  entryComponents: [ FunnelChartComponent, PieChartComponent ]
})
export class DashboardModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Module initialised');
  }

}
