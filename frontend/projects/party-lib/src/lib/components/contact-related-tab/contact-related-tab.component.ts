import { Component } from '@angular/core';

import { TabComponent } from 'serendipity-components-lib';

import { Contact } from '../../models/contact';
import { Role } from '../../models/role';

@Component({
  selector: 'contact-related-tab',
  templateUrl: './contact-related-tab.component.html',
  styleUrls: ['./contact-related-tab.component.scss']
})
export class ContactRelatedTabComponent extends TabComponent<Contact> {

  public addButtonLabel = 'ADD';
  public removeButtonLabel = 'REMOVE';

  public disableAddButton = false;
  public disableRemoveButton = true;

  // private currentUser: any;
  private selectedItem!: any;

  constructor() {
    super();
  }

  public onSelectEvent(role: Role) {

    this.logger.info('ContactRelatedTabComponent: onSelectEvent()');

    if (role.id !== undefined) {

      this.selectedItem = role;

      this.logger.info('selectedItem: ' + JSON.stringify(this.selectedItem, null, 2));

      this.disableAddButton = true;

    } else {

      this.disableAddButton = false;

    }

    this.disableRemoveButton = !this.disableAddButton;

  }

  //
  // Action Bar events
  //

  public onAdd(): void {

  }

  public onRemove(): void {

  }

}
