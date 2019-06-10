import { NgModule } from '@angular/core';

import { ChartModule } from 'angular-highcharts';
import { LineChartComponent } from './angular-highcharts/components/line-chart/line-chart.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NumberCardComponent } from './ngx-charts/components/number-card/number-card.component';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    ChartModule,
    NgxChartsModule,
    UtilsModule
  ],
  declarations: [
    NumberCardComponent,
    LineChartComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [
    NumberCardComponent,
    LineChartComponent ],
  entryComponents: []
})
export class DashboardWidgetsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Widgets Module initialised');
  }

}
