import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';

import item from 'highcharts/modules/item-series';
// item(Highcharts);

@Component({
  selector: 'widget-parliament-chart',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: calc(100% - 40px); display: inline-block;">
    </highcharts-chart>
  `
})
export class ParliamentChartComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = <any>{

    chart: {
      type: 'item'
    },

    title: {
      text: ''
    },

    subtitle: {
      text: ''
    },

    legend: {
      labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
      name: 'Representatives',
      keys: ['name', 'y', 'color', 'label'],
      data: [
        ['The Left', 69, '#BE3075', 'DIE LINKE'],
        ['Social Democratic Party', 153, '#EB001F', 'SPD'],
        ['Alliance 90/The Greens', 67, '#64A12D', 'GRÜNE'],
        ['Free Democratic Party', 80, '#FFED00', 'FDP'],
        ['Christian Democratic Union', 200, '#000000', 'CDU'],
        ['Christian Social Union in Bavaria', 46, '#008AC5', 'CSU'],
        ['Alternative for Germany', 94, '#009EE0', 'AfD']
      ],
      dataLabels: {
        enabled: true,
        format: '{point.label}'
      },

      // Circular options
      center: ['50%', '88%'],
      size: '170%',
      startAngle: -100,
      endAngle: 100
    }]

  };

  constructor() {

    item(this.Highcharts);
  }

  ngOnInit() {}
}
