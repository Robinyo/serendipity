import { Component, EventEmitter, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './navigation-bar.html',
  standalone: true,
  styleUrl: './navigation-bar.scss'
})
export class NavigationBar {

  @Output() toggleSidenav = new EventEmitter<void>();

}
