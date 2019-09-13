import { Injectable } from '@angular/core';

import * as Highcharts from 'highcharts';

import { DashboardWidgetsModule } from '../dashboard-widgets.module';

@Injectable({
  // providedIn: 'root'
  providedIn: DashboardWidgetsModule
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
