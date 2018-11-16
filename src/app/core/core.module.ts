import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { AppRoutingModule } from '@app/app-routing.module';

import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NavComponent } from './components/nav/nav.component';

import { environment } from '@env/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';


//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// Sales lib
//

import { SalesModule } from 'sales';


@NgModule({
  imports: [
    // CommonModule,
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),

    UtilsModule.forRoot(environment),
    DynamicFormsModule.forRoot(environment),
    SalesModule,

    AppRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [ PlaceholderComponent, NavigationBarComponent, NavComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ PlaceholderComponent, NavigationBarComponent, NavComponent ] // TranslateModule
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule,
               private translate: TranslateService,
               private logger: LoggerService) {

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

// this.logger.info('CoreModule: constructor()');
