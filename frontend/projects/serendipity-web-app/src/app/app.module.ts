import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthBffLibModule, authProviders } from 'auth-bff-lib';
import { loggerProviders, LoggerService  } from 'utils-lib';
import { globalErrorProvider } from './providers';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

//
// AppRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    AuthBffLibModule,
    BrowserModule,
    CoreModule,

    // https://angular.io/guide/router#routing-module-order
    AppRoutingModule
  ],
  providers: [
    authProviders,
    // globalErrorProvider,
    loggerProviders
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Application Module initialised');
  }

}
