import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

// import { SerendipityComponentsModule } from '../../serendipity-components.module';

@Injectable({
  providedIn: 'root'
  // providedIn: SerendipityComponentsModule
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

  public toggle() {
    this.opened = !this.opened;
    return this.sidenav.toggle();
  }

  public isOpen(): boolean {
    return this.opened;
  }

}
