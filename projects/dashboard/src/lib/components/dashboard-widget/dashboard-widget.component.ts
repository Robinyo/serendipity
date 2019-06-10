import { AfterViewInit, Component, Input, OnInit, ViewChildren } from '@angular/core';

import { DynamicComponent } from 'ng-dynamic-component';

import { DashboardItem } from '../../models/models';

import { NumberCardComponent } from 'dashboard-widgets';

import { LoggerService } from 'utils';

// No provider for GridsterComponent
// https://github.com/tiberiuzuld/angular-gridster2/issues/56
// https://github.com/tiberiuzuld/angular-gridster2/issues/51

@Component({
  selector: 'dashboard-widget',
  template: `
    <p>Widget goes here</p>
  `,
  styles: []
})
export class DashboardWidgetComponent implements OnInit, AfterViewInit {

  @Input() item: DashboardItem;

  // @ViewChildren(DynamicComponent) component: DynamicComponent;

  widget = NumberCardComponent;

  constructor(private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('DashboardWidgetComponent: ngOnInit()');
  }

  ngAfterViewInit() {

    this.logger.info('DashboardWidgetComponent: ngAfterViewInit');
    // this.logger.info(this.component.componentRef.instance);
  }

}
