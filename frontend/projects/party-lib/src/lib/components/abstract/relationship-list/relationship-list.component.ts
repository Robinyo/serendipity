import { Directive, Input } from '@angular/core';

import { CollectionComponent } from 'serendipity-components-lib';

import { Role } from '../../../models/role';

import { RELATIONSHIP_LIST_COLUMN_DEFS } from '../../../models/column-defs';
import { RELATIONSHIP_LIST_COLUMNS_DESKTOP, RELATIONSHIP_LIST_COLUMNS_MOBILE } from '../../../models/constants';

@Directive()
export abstract class RelationshipListComponent<T> extends CollectionComponent<Role> {

  @Input()
  public item!: T;

  constructor() {

    super({
      columnDefsFilename: RELATIONSHIP_LIST_COLUMN_DEFS,
      desktopDeviceColumns: RELATIONSHIP_LIST_COLUMNS_DESKTOP,
      mobileDeviceColumns: RELATIONSHIP_LIST_COLUMNS_MOBILE,
      limit: 10
    });

  }

}
