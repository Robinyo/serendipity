import { NgModule } from '@angular/core';

import { HighchartsChartModule } from 'highcharts-angular';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { FunnelChartComponent } from './highcharts-angular/components/funnel-chart/funnel-chart.component';

@NgModule({
  imports: [
    HighchartsChartModule,
    UtilsModule
  ],
  declarations: [ FunnelChartComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ FunnelChartComponent ],
  entryComponents: []
})
export class DashboardWidgetsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Widgets Module initialised');
  }

}

/*

// import { ChartModule } from 'angular-highcharts';
// import { LineChartComponent } from './angular-highcharts/components/line-chart/line-chart.component';

// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { NumberCardComponent } from './ngx-charts/components/number-card/number-card.component';

    // ChartModule,
    // NgxChartsModule,

  declarations: [
    NumberCardComponent,
    LineChartComponent ],

  exports: [
    NumberCardComponent,
    LineChartComponent ],

*/
