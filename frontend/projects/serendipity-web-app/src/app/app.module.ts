import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { loggerProviders, LoggerService  } from 'utils-lib';

// import { environment } from '@env/environment';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';


//
// AppRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,

    // https://angular.io/guide/router#routing-module-order
    AppRoutingModule
  ],
  providers: [
    // authProviders,
    // angularMaterialProviders,
    // errorProviders,
    loggerProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Application Module initialised');
  }

}
