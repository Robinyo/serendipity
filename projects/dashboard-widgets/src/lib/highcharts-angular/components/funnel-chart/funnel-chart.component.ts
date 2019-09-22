import { Component, OnInit } from '@angular/core';

import { normalizeCommonJSImport } from '../../normalizeCommonJSImport';

// import * as Highcharts from 'highcharts';
// WebStorm -> tsconfig.lib.json
const loadHighcharts = normalizeCommonJSImport(
  import('highcharts'),
);

// import funnel from 'highcharts/modules/funnel';
const loadFunnelChart = normalizeCommonJSImport(
  import('highcharts/modules/funnel'),
);

import { LoggerService } from 'utils';

@Component({
  selector: 'widget-funnel-chart',
  template: `
    <ng-container *ngIf="highcharts">
      <highcharts-chart
        [highcharts]="highcharts"
        [options]="chartOptions"
        style="width: 100%; height: calc(100% - 40px); display: inline-block;">
      </highcharts-chart>
    </ng-container>
  `
})
export class FunnelChartComponent implements OnInit {

  // Highcharts: typeof Highcharts = Highcharts;
  highcharts: any;
  funnelChart: any;

  // chartOptions: Highcharts.Options = <any>{
  chartOptions: any = {

  chart: {
      type: 'funnel'
    },
    title: { text: '' },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b> ({point.y:,.0f})',
          softConnector: true
        },
        center: ['40%', '50%'],
        neckWidth: '30%',
        neckHeight: '25%',
        width: '80%'
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Unique users',
      data: [
        ['Website visits', 15654],
        ['Downloads', 4064],
        ['Requested price list', 1987],
        ['Invoice sent', 976],
        ['Finalized', 846]
      ]
    }],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            series: {
              dataLabels: {
                inside: true
              },
              center: ['50%', '50%'],
              width: '100%'
            }
          }
        }
      }]
    }

  };

  constructor(private logger: LoggerService) {}

  public async ngOnInit() {

    this.logger.info('FunnelChartComponent: ngOnInit()');

    this.highcharts = await loadHighcharts;

    this.funnelChart = await loadFunnelChart;

    this.funnelChart(this.highcharts);
  }

}

// https://github.com/highcharts/highcharts-angular

// https://github.com/highcharts/highcharts-angular/issues/138
