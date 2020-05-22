import { Component, SimpleChanges, ElementRef, Input, OnInit, OnChanges, OnDestroy, Renderer2 } from '@angular/core';

import { Subscription } from 'rxjs';

import { DashboardConfig, DashboardItemComponentInterface } from '../../models/models';
import { DisplayGrid, GridType } from '../../models/models';
import { DashboardWidget, ToolPaletteItem } from '../../models/models';

import { FunnelChartComponent, ParliamentChartComponent, PieChartComponent } from 'dashboard-widgets';
import { TimelineComponent } from 'dashboard-widgets';
import { DashboardWidgetService } from 'dashboard-widgets';

import { SidenavService } from 'serendipity-components';

import { MockDashboardService } from '../../services/mocks/dashboard/mock-dashboard.service';

import { DialogService } from 'serendipity-components';

import { LoggerService } from 'utils';

import * as screenfull from 'screenfull';
import { Screenfull } from 'screenfull';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dashboardId: string;

  public options: DashboardConfig;
  public items: DashboardWidget[];

  public screenFull = <Screenfull>screenfull;

  public toolPaletteItems: ToolPaletteItem[];

  protected subscription: Subscription;

  private canDrop = true;

  public components = {
    funnelChart: FunnelChartComponent,
    parliamentChart: ParliamentChartComponent,
    pieChart: PieChartComponent,
    timeline: TimelineComponent
  };

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private commandBarSidenavService: SidenavService,
              private dashboardService: MockDashboardService,
              private dashboardWidgetService: DashboardWidgetService,
              private dialogService: DialogService,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('DashboardComponent: ngOnInit()');

    this.getOptions();

    this.getToolPaletteItems();

    this.subscribe();
  }

  public getOptions() {

    //
    // There is some documentation re angular-gridster2's config properties in this file: gridsterConfig.constant.ts
    // See: https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.constant.ts
    //

    this.options = {

      disablePushOnDrag: true,
      displayGrid: DisplayGrid.Always,
      draggable: {
        enabled: true,
        ignoreContent: true,
        // dropOverItems: true,
        dropOverItems: false,
        dragHandleClass: 'drag-handler',
        ignoreContentClass: 'no-drag',
      },
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      emptyCellDropCallback: this.onDrop.bind(this),
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: false,
      gridType: GridType.Fit,
      itemResizeCallback: this.itemResize.bind(this),
      // maxCols: 6,
      // maxRows: 6,
      minCols: 10, // 6
      minRows: 10,  // 6
      pushDirections: { north: true, east: true, south: true, west: true },
      pushItems: true,
      resizable: { enabled: true }
      // swap: true,
    };

  }

  protected subscribe() {

    this.logger.info('DashboardComponent: subscribe()');

    this.subscription = this.dashboardService.getDashboard(this.dashboardId).subscribe(data => {

      this.items = data.widgets;

      // this.logger.info('Dashboard Id: ' + JSON.stringify(data.id));
      // this.logger.info('Widgets: ' + JSON.stringify(this.items));
    });

  }

  public getToolPaletteItems() {

    const subscription: Subscription = this.dashboardService.getToolPaletteItems().subscribe(data => {

      this.toolPaletteItems = data;
      this.logger.info('toolPaletteItems: ' + JSON.stringify(this.toolPaletteItems));

      subscription.unsubscribe();
    });

  }

  public getToolPaletteItem(widgetId: string) {

    return this.toolPaletteItems.find(toolPaletteItem => toolPaletteItem.id === widgetId);
  }

  protected unsubscribe() {

    this.logger.info('DashboardComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngOnChanges(changes: SimpleChanges) {

    this.logger.info('DashboardComponent: ngOnChanges()');

    this.dashboardId = changes.dashboardId.currentValue;

    this.unsubscribe();
    this.subscribe();

  }

  public onDragEnter(event) {

    this.logger.info('DashboardComponent: onDragEnter()');

    //
    // Deleting a widget (GridsterItem) leaves a gridster-preview behind
    // See: https://github.com/tiberiuzuld/angular-gridster2/issues/516
    //

    const gridsterPreviewElements = this.elementRef.nativeElement.getElementsByTagName('gridster-preview');

    // this.renderer.setStyle(gridsterPreview[0], 'display', 'block');
    this.renderer.setStyle(gridsterPreviewElements[0], 'background', 'rgba(0, 0, 0, .15)');

  }

  public onDrop(event) {

    this.logger.info('DashboardComponent: onDrop()');

    //
    // emptyCellDropCallback is called twice
    // See: https://github.com/tiberiuzuld/angular-gridster2/issues/513
    //

    this.logger.info('DashboardComponent: canDrop === ' + this.canDrop);

    if (this.canDrop) {

      this.canDrop = false;

      const widgetId = event.dataTransfer.getData('widgetIdentifier');

      const toolPaletteItem = this.getToolPaletteItem(widgetId);

      const widget = { cols: 4, rows: 4, y: 0, x: 0, ...toolPaletteItem };

      this.items.push(widget);

      setTimeout(() => {
        this.canDrop = true;
      }, 1000);

    }

    // this.logger.info('Widget Id: ' + widgetId);
    // this.logger.info('toolPaletteItem: ' + JSON.stringify(toolPaletteItem));
    // this.logger.info('widget: ' + JSON.stringify(widget));
  }

  public itemResize(item: DashboardWidget, itemComponent: DashboardItemComponentInterface): void {

    this.logger.info('DashboardComponent: itemResize()');

    this.dashboardWidgetService.reflowWidgets();
  }

  public itemChange() {
    this.logger.info('DashboardComponent: itemChange()');
  }

  public ngOnDestroy() {

    this.logger.info('DashboardComponent: ngOnDestroy()');

    if (this.commandBarSidenavService.isOpen()) {

      this.logger.info('commandBarSidenav is open');
      this.commandBarSidenavService.toggle();
    }

    this.unsubscribe();
  }

  //
  // Toolbar events
  //

  public onDelete(item) {

    this.logger.info('DashboardComponent: onDelete()');

    this.items.splice(this.items.indexOf(item), 1);

    //
    // Deleting a widget (GridsterItem) leaves a gridster-preview behind
    // See: https://github.com/tiberiuzuld/angular-gridster2/issues/516
    //

    const gridsterPreviewElements = this.elementRef.nativeElement.getElementsByTagName('gridster-preview');

    // this.renderer.setStyle(gridsterPreview[0], 'display', 'none !important');
    this.renderer.setStyle(gridsterPreviewElements[0], 'background', '#fafafa');

    // this.logger.info('Widgets: ' + JSON.stringify(this.items));

  }

  public onSettings(item) {

    this.logger.info('DashboardComponent: onSettings()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: 'You clicked the Settings button.',
      closeButton: 'CLOSE'
    });

  }

}

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.ts
// https://github.com/NastyZ98/angular6-dynamic-dashboard/blob/master/src/app/dashboard/dashboard.component.ts

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.html
// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.ts

// https://github.com/highcharts/highcharts/issues/6427 -> style="overflow: hidden;"

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
// window.dispatchEvent(new Event('dragenter'));
