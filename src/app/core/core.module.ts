import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FlexLayoutModule } from '@angular/flex-layout';

import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NavComponent } from './components/nav/nav.component';

import { environment } from '@env/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';

//
// Firebase Hosting
//

// https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md

// import { AngularFireModule } from '@angular/fire';

//
// Dashboard Widgets lib
//

import { HighchartsChartModule } from 'highcharts-angular';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// Sales lib
//

// import { SalesModule } from 'sales';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

@NgModule({
  imports: [
    // AngularFireModule.initializeApp(environment.firebase),
    // The Angular Material module must be imported after Angular's BrowserModule, as the import order matters for NgModules.
    AngularMaterialModule,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    HighchartsChartModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),

    DynamicFormsModule.forRoot(environment),
    // SalesModule,
    UtilsModule.forRoot(environment),

    RouterModule  // There is no directive with "exportAs" set to "routerLinkActive ...
  ],
  declarations: [ PlaceholderComponent, NavigationBarComponent, NavComponent ],
  exports: [ PlaceholderComponent, NavigationBarComponent, NavComponent ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule,
              private translate: TranslateService,
              private logger: LoggerService) {

    this.logger.info('Core Module initialised');

    // 'en-GB' -> 'en'
    const defaultLanguage = environment.defaultLanguage.split('-')[0];

    this.logger.info('Default Language: ' + defaultLanguage);
    this.logger.info('Local: ' + environment.defaultLanguage.split('-')[1]);

    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);

    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// https://stackoverflow.com/questions/50860898/angular-6-services-providedin-root-vs-coremodule
