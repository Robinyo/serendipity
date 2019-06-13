import { Injectable } from '@angular/core';

import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav: MatSidenav;
  private opened = false;

  public setSidenav(sidenav: MatSidenav) {
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

  public toggle(): void {
    this.opened = !this.opened;
    this.sidenav.toggle();
  }

  public isOpen(): boolean {
    return this.opened;
  }

}
