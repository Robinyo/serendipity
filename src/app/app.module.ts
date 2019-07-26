import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MAT_DATE_LOCALE } from '@angular/material';

import { environment } from '@env/environment';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

//
// Auth libs
//

// import { AuthModule } from 'auth';
// import { AuthOktaModule, authProviders } from 'auth-okta';
import { Auth0AuthModule, authProviders } from 'auth-auth0';

//
// Utils lib
//

import { LoggerService, loggerProviders } from 'utils';

//
// App Routing Module
//

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    Auth0AuthModule.forRoot(environment),
    CoreModule,
    AppRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ AppComponent ],
  providers: [
    loggerProviders,
    authProviders,
    {
      provide: MAT_DATE_LOCALE,
      useValue: environment.defaultLanguage
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

  constructor(private logger: LoggerService) {

    this.logger.info('App Module initialised');
  }

}
