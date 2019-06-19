import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module';
// import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoggerService } from 'utils';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    // SharedModule,
    AppRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ AppComponent ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {

  constructor(private logger: LoggerService) {

    this.logger.info('App Module initialised');
  }

}
