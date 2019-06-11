import { Injectable } from '@angular/core';

import * as Highcharts from 'highcharts';

// import Exporting from 'highcharts/modules/exporting';
import funnel from 'highcharts/modules/funnel';

// Exporting(Highcharts);
funnel(Highcharts);

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
