import { Directive, Input } from '@angular/core';

import { Collection } from 'serendipity-components-lib';

import { RoleModel } from '../../../models/role';

// import { COLUMN_DEFS } from './column-defs';
import { COLUMNS_DESKTOP, COLUMNS_MOBILE } from './constants';

@Directive()
export abstract class RelationshipList<T> extends Collection<RoleModel> {

  @Input()
  public item!: T;

  protected constructor() {

    super({
      // columnDefsFilename: COLUMN_DEFS,
      columnDefsFilename: "",
      desktopDeviceColumns: COLUMNS_DESKTOP,
      mobileDeviceColumns: COLUMNS_MOBILE,
      limit: 10
    });

  }

}
