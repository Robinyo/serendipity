import { Injectable } from '@angular/core';

import * as Highcharts from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class DashboardWidgetService {

  constructor() { }

  public reflowWidgets() {

    Highcharts.charts.forEach(chart => {

      // ERROR TypeError: Cannot read property 'reflow' of undefined
      if (chart) {
        chart.reflow();
      }

    });

  }

}
