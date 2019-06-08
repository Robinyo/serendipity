// import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';

// https://google.github.io/styleguide/jsoncstyleguide.xml

// tslint:disable-next-line:no-empty-interface
export interface DashboardConfig extends GridsterConfig {

}

export interface DashboardItem extends GridsterItem {

  /*

  x: number;
  y: number;
  rows: number;
  cols: number;
  initCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  compactEnabled?: boolean;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;

  [propName: string]: any;

  */

  component?: any;
  name?: string;

}

// https://github.com/tiberiuzuld/angular-gridster2/blob/v7.2.0/projects/angular-gridster2/src/lib/gridsterItem.interface.ts
