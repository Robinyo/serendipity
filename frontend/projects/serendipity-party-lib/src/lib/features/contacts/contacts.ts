import { Component } from '@angular/core';

import { CommandBar } from 'serendipity-components-lib';

@Component({
  selector: 'lib-contacts',
  imports: [
    CommandBar
  ],
  templateUrl: './contacts.html',
  standalone: true,
  styleUrl: './contacts.css'
})
export class Contacts {

}
