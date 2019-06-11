import { Injectable } from '@angular/core';

import * as Highcharts from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class HighchartsService {

  constructor() { }

  public reflowWidgets() {

    Highcharts.charts.forEach(chart => {
      chart.reflow();
    });

  }

}
