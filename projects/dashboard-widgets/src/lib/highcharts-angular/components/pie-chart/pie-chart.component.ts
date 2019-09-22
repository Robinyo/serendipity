import { Component, OnInit } from '@angular/core';

import { normalizeCommonJSImport } from '../../normalizeCommonJSImport';

// import * as Highcharts from 'highcharts';
// WebStorm -> tsconfig.lib.json
const loadHighcharts = normalizeCommonJSImport(
  import('highcharts'),
);

import { LoggerService } from 'utils';

@Component({
  selector: 'widget-pie-chart',
  template: `
    <ng-container *ngIf="highcharts">
      <highcharts-chart
        [highcharts]="highcharts"
        [options]="chartOptions"
        style="width: 100%; height: calc(100% - 40px); display: inline-block;">
      </highcharts-chart>
    </ng-container>
  `,
  styles: []
})
export class PieChartComponent implements OnInit {

  // Highcharts: typeof Highcharts = Highcharts;
  highcharts: any;

  // chartOptions: Highcharts.Options = <any>{
  chartOptions: any = {

    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: { text: '' },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            // color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            // color: 'black'
          }
        }
      }
    },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      data: [{
        name: 'Chrome',
        y: 61.41,
        sliced: true,
        selected: true
      }, {
        name: 'Internet Explorer',
        y: 11.84
      }, {
        name: 'Firefox',
        y: 10.85
      }, {
        name: 'Edge',
        y: 4.67
      }, {
        name: 'Safari',
        y: 4.18
      }, {
        name: 'Sogou Explorer',
        y: 1.64
      }, {
        name: 'Opera',
        y: 1.6
      }, {
        name: 'QQ',
        y: 1.2
      }, {
        name: 'Other',
        y: 2.61
      }]
    }]

  };

  constructor(private logger: LoggerService) {}

  public async ngOnInit() {

    this.logger.info('PieChartComponent: ngOnInit()');

    this.highcharts = await loadHighcharts;

  }

}
