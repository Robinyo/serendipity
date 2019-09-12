import { NgModule } from '@angular/core';

import { HighchartsChartModule } from 'highcharts-angular';

import { FunnelChartComponent } from './highcharts-angular/components/funnel-chart/funnel-chart.component';
import { ParliamentChartComponent } from './highcharts-angular/components/parliament-chart/parliament-chart.component';
import { PieChartComponent } from './highcharts-angular/components/pie-chart/pie-chart.component';
import { TimelineComponent } from './highcharts-angular/components/timeline/timeline.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';

@NgModule({
  imports: [
    HighchartsChartModule,
    UtilsModule
  ],
  declarations: [ FunnelChartComponent, ParliamentChartComponent, PieChartComponent, TimelineComponent ],
  exports: [ FunnelChartComponent, ParliamentChartComponent, PieChartComponent, TimelineComponent ]
})
export class DashboardWidgetsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Widgets Module initialised');
  }

}

// https://medium.com/lacolaco-blog/angular-dynamic-importing-large-libraries-8ec079603d0
