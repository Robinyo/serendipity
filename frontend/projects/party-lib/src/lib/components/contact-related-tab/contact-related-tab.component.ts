import { Component } from '@angular/core';

import { TabComponent } from 'serendipity-components-lib';

import { Contact } from '../../models/contact';

@Component({
  selector: 'contact-related-tab',
  templateUrl: './contact-related-tab.component.html',
  styleUrls: ['./contact-related-tab.component.scss']
})
export class ContactRelatedTabComponent extends TabComponent<Contact> {

  constructor() {
    super();
  }

}
