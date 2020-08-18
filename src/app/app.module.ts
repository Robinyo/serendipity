import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { LocalAuthModule, authProviders } from 'auth-local';
// import { Auth0AuthModule, authProviders } from 'auth-auth0';
// import { OktaAuthModule, authProviders } from 'auth-okta';
import { OidcAuthModule, authProviders } from 'auth-oidc';
import { DynamicFormsModule } from 'dynamic-forms';
import { LoggerService, loggerProviders } from 'utils';

import { environment } from '@env/environment';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { angularMaterialProviders, errorProviders } from './providers';

//
// AppRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    DynamicFormsModule.forRoot(environment),
    // LocalAuthModule,
    // Auth0AuthModule.forRoot(environment),
    // OktaAuthModule.forRoot(environment),
    OidcAuthModule.forRoot(environment),

    // https://angular.io/guide/router#routing-module-order
    AppRoutingModule
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
