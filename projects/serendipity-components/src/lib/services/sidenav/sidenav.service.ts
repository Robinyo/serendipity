import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav: MatSidenav;
  private opened = false;

  constructor(private logger: LoggerService) {}

  public setSidenav(sidenav: MatSidenav) {

    if (!sidenav) {
      this.logger.error('NavComponent: sidenav cannot be null');
    }

    this.sidenav = sidenav;
  }

  public open() {
    this.opened = true;
    return this.sidenav.open();
  }

  public close() {
    this.opened = false;
    return this.sidenav.close();
  }

  public toggle() {
    this.opened = !this.opened;
    return this.sidenav.toggle();
  }

  public isOpen(): boolean {
    return this.opened;
  }

}
