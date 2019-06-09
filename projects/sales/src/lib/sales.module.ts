import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AccountsComponent } from './components/accounts/accounts.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SnackBarComponent, ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/mocks/api/in-memory-data.service';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService, StaticInjectorService } from 'utils';
import { AngularMaterialModule } from 'utils';

//
// Flowable lib
//

import { FlowableModule } from 'flowable';

//
// Serendipity Components lib
//

import { SerendipityComponentsModule } from 'serendipity-components';

//
// Dashboard lib
//

import { DashboardModule } from 'dashboard';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DashboardModule,
    FlexLayoutModule,
    FlowableModule,
    // HttpClientModule,
    ReactiveFormsModule,

    HttpClientInMemoryWebApiModule.forFeature(InMemoryDataService, { passThruUnknownUrl: true, delay: 1000 }),

    TranslateModule.forChild(),

    UtilsModule,
    SerendipityComponentsModule,
    DynamicFormsModule,

    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [
    AccountsComponent,
    ActivitiesComponent,
    ContactsComponent,
    ContactComponent,
    DashboardComponent,

    SnackBarComponent
  ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [
    AccountsComponent,
    ActivitiesComponent,
    ContactsComponent,
    ContactComponent,
    DashboardComponent,

    SnackBarComponent
  ],
  entryComponents: [ SnackBarComponent ]
})
export class SalesModule {

  constructor(private injector: Injector,
              private logger: LoggerService) {

    this.logger.info('Sales Module initialised');

    StaticInjectorService.setInjector(injector);
  }

}

// import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
// import { DynamicFormsMaterialUIModule } from '@ng-dynamic-forms/ui-material';

// DynamicFormsCoreModule,
// DynamicFormsMaterialUIModule,

/*

// this.logger.info('SalesModule: constructor()');

// import { LoggerService } from './services/logger/logger.service';
// import { ConsoleLoggerService } from './services/logger/console-logger.service';

// { provide: LoggerService, useClass: ConsoleLoggerService }

[ ContactsComponent, AccountsComponent, LoggerService, ConsoleLoggerService ]

// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';

*/
