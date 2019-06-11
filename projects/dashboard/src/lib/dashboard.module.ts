import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterModule } from 'angular-gridster2';

import { DashboardComponent } from './components/dashboard/dashboard.component';

//
// Dashboard Widgets lib
//

import { DynamicModule } from 'ng-dynamic-component';
import { DashboardWidgetsModule, FunnelChartComponent, PieChartComponent } from 'dashboard-widgets';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    CommonModule,
    DashboardWidgetsModule,
    DynamicModule.withComponents([ FunnelChartComponent, PieChartComponent ]),
    GridsterModule,
    UtilsModule
  ],
  declarations: [ DashboardComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ DashboardComponent ],
  entryComponents: []
})
export class DashboardModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Module initialised');
  }

}
