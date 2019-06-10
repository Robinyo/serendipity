import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterModule } from 'angular-gridster2';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardWidgetComponent } from './components/dashboard-widget/dashboard-widget.component';

//
// Dashboard Widgets lib
//

import { DynamicModule } from 'ng-dynamic-component';
import { DashboardWidgetsModule, LineChartComponent } from 'dashboard-widgets';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    CommonModule,
    DashboardWidgetsModule,
    DynamicModule.withComponents([ LineChartComponent ]),
    GridsterModule,
    UtilsModule
  ],
  declarations: [ DashboardComponent, DashboardWidgetComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ DashboardComponent, DashboardWidgetComponent ],
  entryComponents: []
})
export class DashboardModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Module initialised');
  }

}
