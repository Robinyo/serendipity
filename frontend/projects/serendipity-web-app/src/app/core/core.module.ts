import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

import { CookieService } from 'ngx-cookie-service';

import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
import { AngularMaterialModule, UtilsLibModule, LoggerService } from 'utils-lib';

import { AuthorizationCodeCallbackComponent } from './components/authorization-code-callback/authorization-code-callback.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

import { environment } from '@env/environment';

const components: any[] = [
  AuthorizationCodeCallbackComponent,
  HomeComponent,
  NavigationBarComponent,
  PlaceholderComponent,
  SidenavComponent
];

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    AngularMaterialModule,    // The Angular Material module must be imported after Angular's BrowserModule, as the import order matters
    BrowserAnimationsModule,  // for NgModules.
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    SerendipityComponentsLibModule,

    UtilsLibModule.forRoot(environment),

    RouterModule
  ],
  exports: [ ...components ],
  providers: [
    CookieService,
    { provide: LOCALE_ID, useValue: 'en' }
  ]
})
export class CoreModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Core Module initialised');
  }

}
