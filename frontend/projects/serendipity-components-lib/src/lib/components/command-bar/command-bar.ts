import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'command-bar',
  imports: [
    MatToolbar,
    MatToolbarRow
  ],
  templateUrl: './command-bar.html',
  standalone: true,
  styleUrl: './command-bar.css'
})
export class CommandBar {

}
