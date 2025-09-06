import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CommandBar } from 'serendipity-components-lib';

@Component({
  selector: 'lib-contacts',
  imports: [
    CommandBar,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './contacts.html',
  standalone: true,
  styleUrl: './contacts.scss'
})
export class Contacts {

}
