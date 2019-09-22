import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//
// Widgets
//

import { HighchartsChartComponent } from './components/chart/highcharts-chart.component';

import { FunnelChartComponent } from './components/funnel-chart/funnel-chart.component';
import { ParliamentChartComponent } from './components/parliament-chart/parliament-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { TimelineComponent } from './components/timeline/timeline.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';

const widgets = [
  HighchartsChartComponent,
  FunnelChartComponent,
  ParliamentChartComponent,
  PieChartComponent,
  TimelineComponent
];

@NgModule({
  imports: [
    CommonModule,
    UtilsModule
  ],
  declarations: [
    ...widgets
  ],
  exports: [
    ...widgets
  ]
})
export class HighchartsAngularModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Highcharts Angular Module initialised');
  }

}

// https://github.com/highcharts/highcharts-angular/blob/master/highcharts-angular/src/lib/highcharts-chart.module.ts

// https://medium.com/lacolaco-blog/angular-dynamic-importing-large-libraries-8ec079603d0

// https://github.com/lacolaco/angular-chartjs-dynamic-import
