import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'auth';

@Component({
  selector: 'crm-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authService: AuthService,
              private router: Router) {}

  public logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
