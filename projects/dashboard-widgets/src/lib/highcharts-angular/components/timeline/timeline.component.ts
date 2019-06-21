import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';

import timeline from 'highcharts/modules/timeline';
// timeline(Highcharts);

@Component({
  selector: 'widget-timeline',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: calc(100% - 40px); display: inline-block;">
    </highcharts-chart>
  `
})
export class TimelineComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = <any>{

    chart: {
      type: 'timeline'
    },
    xAxis: {
      visible: false
    },
    yAxis: {
      visible: false
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    colors: [
      '#4185F3',
      '#427CDD',
      '#406AB2',
      '#3E5A8E',
      '#3B4A68',
      '#363C46'
    ],
    series: [{
      data: [{
        name: 'First dogs',
        label: '1951: First dogs in space',
        description: '22 July 1951 First dogs in space (Dezik and Tsygan) '
      }, {
        name: 'Sputnik 1',
        label: '1957: First artificial satellite',
        description: '4 October 1957 First artificial satellite. First signals from space.'
      }, {
        name: 'First human spaceflight',
        label: '1961: First human spaceflight (Yuri Gagarin)',
        description: 'First human spaceflight (Yuri Gagarin), and the first human-crewed orbital flight'
      }, {
        name: 'First human on the Moon',
        label: '1969: First human on the Moon',
        // tslint:disable-next-line:max-line-length
        description: 'First human on the Moon, and first space launch from a celestial body other than the Earth. First sample return from the Moon'
      }, {
        name: 'First space station',
        label: '1971: First space station',
        // tslint:disable-next-line:max-line-length
        description: 'Salyut 1 was the first space station of any kind, launched into low Earth orbit by the Soviet Union on April 19, 1971.'
      }, {
        name: 'Apollo–Soyuz Test Project',
        label: '1975: First multinational manned mission',
        // tslint:disable-next-line:max-line-length
        description: 'The mission included both joint and separate scientific experiments, and provided useful engineering experience for future joint US–Russian space flights, such as the Shuttle–Mir Program and the International Space Station.'
      }]
    }]

  };

  constructor() {

    timeline(this.Highcharts);
  }

  ngOnInit() {}
}
