import { Injectable } from '@angular/core';

import { normalizeCommonJSImport } from '../highcharts-angular/normalizeCommonJSImport';

// import * as Highcharts from 'highcharts';
// WebStorm -> tsconfig.lib.json
const loadHighcharts = normalizeCommonJSImport(
  import('highcharts'),
);

import { DashboardWidgetsModule } from '../dashboard-widgets.module';

import { LoggerService } from 'utils';

@Injectable({
  // providedIn: 'root'
  providedIn: DashboardWidgetsModule
})
export class DashboardWidgetService {

  highcharts: any;

  constructor(private logger: LoggerService) {

    this.logger.info('DashboardWidgetService initialised');

    this.init();
  }

  public async init() {

    this.logger.info('DashboardWidgetService: init()');

    this.highcharts = await loadHighcharts;
  }

  public reflowWidgets() {

    if (this.highcharts && this.highcharts.charts) {

      this.highcharts.charts.forEach(chart => {

        // ERROR TypeError: Cannot read property 'reflow' of undefined
        if (chart) {
          chart.reflow();
        }

      });

    }

  }

}

/*

  public reflowWidgets() {

    Highcharts.charts.forEach(chart => {

      // ERROR TypeError: Cannot read property 'reflow' of undefined
      if (chart) {
        chart.reflow();
      }

    });

  }

*/
