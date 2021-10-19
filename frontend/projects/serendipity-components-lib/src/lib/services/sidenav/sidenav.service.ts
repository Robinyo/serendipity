import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { LoggerService } from 'utils-lib';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav: MatSidenav | undefined;
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
    // @ts-ignore
    return this.sidenav.open();
  }

  public close() {
    this.opened = false;
    // @ts-ignore
    return this.sidenav.close();
  }

  public toggle() {
    this.opened = !this.opened;
    // @ts-ignore
    return this.sidenav.toggle();
  }

  public isOpen(): boolean {
    return this.opened;
  }

}
