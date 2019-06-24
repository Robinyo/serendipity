import { GridsterConfig, GridsterItem, GridsterItemComponentInterface } from 'angular-gridster2';

// https://google.github.io/styleguide/jsoncstyleguide.xml

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.interface.ts

export enum DisplayGrid {
  Always = 'always',
  OnDragAndResize = 'onDrag&Resize',
  None = 'none'
}

export enum CompactType {
  None = 'none',
  CompactUp = 'compactUp',
  CompactLeft = 'compactLeft',
  CompactUpAndLeft = 'compactUp&Left',
  CompactLeftAndUp = 'compactLeft&Up',
  CompactRight = 'compactRight',
  CompactUpAndRight = 'compactUp&Right',
  CompactRightAndUp = 'compactRight&Up',
}

export enum GridType {
  Fit = 'fit',
  ScrollVertical = 'scrollVertical',
  ScrollHorizontal = 'scrollHorizontal',
  Fixed = 'fixed',
  VerticalFixed = 'verticalFixed',
  HorizontalFixed = 'horizontalFixed'
}

// https://github.com/tiberiuzuld/angular-gridster2/blob/v7.2.0/projects/angular-gridster2/src/lib/gridsterConfig.interface.ts

// tslint:disable-next-line:no-empty-interface
export interface DashboardConfig extends GridsterConfig {

  /*

  // https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.constant.ts

  gridType?: gridTypes;
  fixedColWidth?: number;
  fixedRowHeight?: number;
  keepFixedHeightInMobile?: boolean;
  keepFixedWidthInMobile?: boolean;
  setGridSize?: boolean;
  compactType?: compactTypes;
  mobileBreakpoint?: number;
  minCols?: number;
  maxCols?: number;
  minRows?: number;
  maxRows?: number;
  defaultItemCols?: number;
  defaultItemRows?: number;
  maxItemCols?: number;
  maxItemRows?: number;
  minItemCols?: number;
  minItemRows?: number;
  minItemArea?: number;
  maxItemArea?: number;
  margin?: number;
  outerMargin?: boolean;
  outerMarginTop?: number | null;
  outerMarginRight?: number | null;
  outerMarginBottom?: number | null;
  outerMarginLeft?: number | null;
  useTransformPositioning?: boolean;
  scrollSensitivity?: number | null;
  scrollSpeed?: number;
  initCallback?: (gridster: GridsterComponentInterface) => void;
  destroyCallback?: (gridster: GridsterComponentInterface) => void;
  gridSizeChangedCallback?: (gridster: GridsterComponentInterface) => void;
  itemChangeCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  itemResizeCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  itemInitCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  itemRemovedCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  itemValidateCallback?: (item: GridsterItem) => boolean;
  draggable?: Draggable;
  resizable?: Resizable;
  swap?: boolean;
  pushItems?: boolean;
  disablePushOnDrag?: boolean;
  disablePushOnResize?: boolean;
  disableAutoPositionOnConflict?: boolean;
  pushDirections?: PushDirections;
  pushResizeItems?: boolean;
  displayGrid?: displayGrids;
  disableWindowResize?: boolean;
  disableWarnings?: boolean;
  scrollToNewItems?: boolean;
  disableScrollHorizontal?: boolean;
  disableScrollVertical?: boolean;
  enableEmptyCellClick?: boolean;
  enableEmptyCellContextMenu?: boolean;
  enableEmptyCellDrop?: boolean;
  enableEmptyCellDrag?: boolean;
  emptyCellClickCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellContextMenuCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellDropCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellDragCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellDragMaxCols?: number;
  emptyCellDragMaxRows?: number;
  ignoreMarginInRow?: boolean;
  api?: {
    resize?: () => void,
    optionsChanged?: () => void,
    getNextPossiblePosition?: (newItem: GridsterItem) => boolean,
    getFirstPossiblePosition?: (item: GridsterItem) => GridsterItem,
    getLastPossiblePosition?: (item: GridsterItem) => GridsterItem,
  };

  [propName: string]: any;

  */

}

// https://github.com/tiberiuzuld/angular-gridster2/blob/v7.2.0/projects/angular-gridster2/src/lib/gridsterItem.interface.ts

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

  id?: string;
  name?: string;
  component?: any;
  // icon?: string;

}

// https://github.com/tiberiuzuld/angular-gridster2/blob/v7.2.0/projects/angular-gridster2/src/lib/gridsterItemComponent.interface.ts

// tslint:disable-next-line:no-empty-interface
export interface DashboardItemComponentInterface extends GridsterItemComponentInterface {

  /*

  item: GridsterItem;
  $item: GridsterItem;
  top: number;
  left: number;
  width: number;
  height: number;
  drag: GridsterDraggable;
  resize: GridsterResizable;
  notPlaced: boolean;
  updateOptions: () => void;
  itemChanged: () => void;
  setSize: () => void;
  checkItemChanges: (newValue: GridsterItem, oldValue: GridsterItem) => void;
  canBeDragged: () => boolean;
  canBeResized: () => boolean;
  el: any;
  gridster: GridsterComponentInterface;
  renderer: Renderer2;

  */

}

// tslint:disable-next-line:no-empty-interface
export interface DashboardWidget extends DashboardItem {

}

export interface Dashboard {

  id?: string;
  name?: string;
  widgets?: Array<DashboardWidget>;

}

export interface ToolPaletteItem {

  id?: string;
  name?: string;
  component?: any;
  icon?: string;

}
