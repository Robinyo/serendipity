import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule, UtilsLibModule, LoggerService } from 'utils-lib';

import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

import { environment } from '@env/environment';


const components: any[] = [
  NavigationBarComponent,
  PlaceholderComponent,
  SidenavComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    AngularMaterialModule,    // The Angular Material module must be imported after Angular's BrowserModule, as the import order matters
    BrowserAnimationsModule,  // for NgModules.
    CommonModule,
    HttpClientModule,

    UtilsLibModule.forRoot(environment),

    RouterModule
  ],
  exports: [ ...components ],
  providers: [ { provide: LOCALE_ID, useValue: 'en' } ]
})
export class CoreModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Core Module initialised');
  }

}
