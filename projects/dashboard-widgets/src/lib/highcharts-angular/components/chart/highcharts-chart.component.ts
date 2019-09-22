import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, NgZone } from '@angular/core';

// import * as Highcharts from 'highcharts';

import { LoggerService } from 'utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'highcharts-chart',
  template: ''
})
export class HighchartsChartComponent implements OnInit, OnDestroy {

  // @Input() Highcharts: typeof Highcharts;
  @Input() highcharts: any;
  @Input() constructorType: string;
  // @Input() callbackFunction: Highcharts.ChartCallbackFunction;
  @Input() callbackFunction: any;
  @Input() oneToOne: boolean;
  @Input() runOutsideAngular: boolean;

  // @Input() set options(val: Highcharts.Options) {
  @Input() set options(val: any) {

    this.optionsValue = val;
    this.wrappedUpdateOrCreateChart();
  }

  @Input() set update(val: boolean) {

    if (val) {
      this.wrappedUpdateOrCreateChart();

      // clear the flag after update
      this.updateChange.emit(false);
    }
  }

  @Output() updateChange = new EventEmitter<boolean>(true);
  // @Output() chartInstance = new EventEmitter<Highcharts.Chart>();
  @Output() chartInstance = new EventEmitter<any>();

  // private chart: Highcharts.Chart;
  private chart: any;
  // private optionsValue: Highcharts.Options;
  private optionsValue: any;

  constructor(private el: ElementRef,
              private _zone: NgZone,
              private logger: LoggerService) {}

  public async ngOnInit() {

    this.logger.info('HighchartsChartComponent: ngOnInit()');
  }

  wrappedUpdateOrCreateChart() {

    this.logger.info('HighchartsChartComponent: wrappedUpdateOrCreateChart()');

    if (this.runOutsideAngular) {
      this._zone.runOutsideAngular(() => {
        this.updateOrCreateChart();
      });
    } else {
      this.updateOrCreateChart();
    }

  }

  updateOrCreateChart() {

    this.logger.info('HighchartsChartComponent: updateOrCreateChart()');

    if (this.chart && this.chart.update) {

      this.logger.info('HighchartsChartComponent: update chart');

      this.chart.update(this.optionsValue, true, this.oneToOne || false);

    } else {

      this.logger.info('HighchartsChartComponent: create chart');

      this.chart = (this.highcharts as any)[this.constructorType || 'chart'](
        this.el.nativeElement,
        this.optionsValue,
        this.callbackFunction || null
      );

      // emit chart instance on init
      this.chartInstance.emit(this.chart);
    }

  }

  ngOnDestroy() {

    this.logger.info('HighchartsChartComponent: ngOnDestroy()');

    if (this.chart) {

      this.chart.destroy();
      this.chart = null;
    }

  }

}

// https://github.com/highcharts/highcharts-angular/blob/master/highcharts-angular/src/lib/highcharts-chart.component.ts

// https://medium.com/lacolaco-blog/angular-dynamic-importing-large-libraries-8ec079603d0

// https://github.com/lacolaco/angular-chartjs-dynamic-import
