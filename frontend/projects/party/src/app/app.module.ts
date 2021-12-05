import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AngularMaterialModule, loggerProviders, LoggerService, UtilsLibModule } from 'utils-lib';

import { environment } from '@env/environment';

import { FeaturesModule } from './features/features.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

//
// AppRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    // The Angular Material module must be imported after Angular's BrowserModule, as the import order matters
    AngularMaterialModule,
    BrowserAnimationsModule,
    FeaturesModule,

    UtilsLibModule.forRoot(environment),

    // https://angular.io/guide/router#routing-module-order
    AppRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en' },
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
