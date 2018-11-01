import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from '@app/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { AppRoutingModule } from '@app/app-routing.module';

import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { NavComponent } from './components/nav/nav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

// import { LoggerService, ConsoleLoggerService } from '@app/core';

import { environment } from '@env/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';

//
// Sales lib
//

import { SalesModule } from 'sales';
// import { LoggerService, ConsoleLoggerService } from 'sales/public_api';
// import { LoggerService, ConsoleLoggerService } from 'sales';

@NgModule({
  imports: [
    // CommonModule,
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    // environment.production ? [] : HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true, delay: 1500 }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),

    SalesModule,

    AppRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ PlaceholderComponent, NavComponent, ToolbarComponent ],
  providers: [
    // { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ PlaceholderComponent, NavComponent, ToolbarComponent ] // TranslateModule
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule,
               private translate: TranslateService) {

    translate.setDefaultLang(environment.defaultLanguage);
    translate.use(environment.defaultLanguage);

    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// https://stackoverflow.com/questions/50860898/angular-6-services-providedin-root-vs-coremodule
