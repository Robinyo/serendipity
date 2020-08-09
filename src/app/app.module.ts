import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';

import { angularMaterialProviders, errorProviders } from './providers';

import { environment } from '@env/environment';

//
// Auth libs
//

// import { LocalAuthModule, authProviders } from 'auth-local';
// import { Auth0AuthModule, authProviders } from 'auth-auth0';
// import { OktaAuthModule, authProviders } from 'auth-okta';
import { OidcAuthModule, authProviders } from 'auth-oidc';

//
// Utils lib
//

import { LoggerService, loggerProviders } from 'utils';

//
//
// Dynamic Forms lib
//
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// AppRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    // LocalAuthModule,
    // Auth0AuthModule.forRoot(environment),
    // OktaAuthModule.forRoot(environment),
    OidcAuthModule.forRoot(environment),
    CoreModule,
    DynamicFormsModule.forRoot(environment),
    AppRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ AppComponent ],
  providers: [
    authProviders,
    angularMaterialProviders,
    errorProviders,
    loggerProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

  constructor(private logger: LoggerService) {

    this.logger.info('App Module initialised');
  }

}
