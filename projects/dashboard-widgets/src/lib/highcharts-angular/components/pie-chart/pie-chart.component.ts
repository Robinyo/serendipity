import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';

import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);

@Component({
  selector: 'widget-pie-chart',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 100%; display: inline-block;">
    </highcharts-chart>
  `,
  styles: []
})
export class PieChartComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = <any>{

    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'All Opportunities'
    },
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

  constructor() { }

  ngOnInit() {
  }

}
