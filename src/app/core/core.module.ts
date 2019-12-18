import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { QuillModule } from 'ngx-quill';

import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NavComponent } from './components/nav/nav.component';

import { environment } from '@env/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';

//
// Serendipity Components lib
//

import { SerendipityComponentsModule } from 'serendipity-components';

//
//
// Lazy Loaded Libs -> app.module.ts
//
//

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
    HttpClientModule,
    QuillModule.forRoot(),
    SerendipityComponentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),

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

    // 'en-gb' -> 'en'
    const defaultLanguage = environment.defaultLanguage.split('-')[0];

    this.logger.info('Default Language: ' + defaultLanguage);
    this.logger.info('Local: ' + environment.defaultLanguage.split('-')[1]);

    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);

    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

// https://stackoverflow.com/questions/50860898/angular-6-services-providedin-root-vs-coremodule

// https://github.com/angular/angular/issues/29848 -> Keep CoreModule as preferred location for app-wide single-use components

//
// Firebase Hosting
//

// https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md

// import { AngularFireModule } from '@angular/fire';
