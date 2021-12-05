import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { CookieService } from 'ngx-cookie-service';

//
// Libs
//

import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
import { AngularMaterialModule, ConfigService, UtilsLibModule, LoggerService } from 'utils-lib';

//
// Components - local
//

import { LoginSuccessComponent } from './components/login-success/login-success.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

import { environment } from '@env/environment';

const components: any[] = [
  LoginSuccessComponent,
  HomeComponent,
  NavigationBarComponent,
  PlaceholderComponent,
  SidenavComponent
];

@NgModule({
  imports: [
    AngularMaterialModule,    // The Angular Material module must be imported after Angular's BrowserModule, as the
    BrowserAnimationsModule,  // import order matters for NgModules.
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
    SerendipityComponentsLibModule,

    UtilsLibModule.forRoot(environment),

    RouterModule
  ],
  declarations: [
    ...components,
  ],
  exports: [
    ...components
  ],
  providers: [
    CookieService,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CoreModule {

  constructor(private configService: ConfigService,
              private logger: LoggerService) {

    this.logger.info('Core Module initialised');

    this.configService.loadSvgIcons();

  }

}

// https://roufid.com/angular-spring-security-csrf-configuration/
