import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsMaterialUIModule } from '@ng-dynamic-forms/ui-material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './shared/angular-material.module';

import { LibRoutingModule } from './lib-routing.module';

import { AccountsComponent } from './components/accounts/accounts.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';

import { StaticInjectorService } from './services/injector/static-injector.service';
import { LoggerService } from './services/logger/logger.service';
import { ConsoleLoggerService } from './services/logger/console-logger.service';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/mocks/api/in-memory-data.service';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DynamicFormsCoreModule,
    DynamicFormsMaterialUIModule,

    HttpClientInMemoryWebApiModule.forFeature(InMemoryDataService, { passThruUnknownUrl: true, delay: 1500 }),

    TranslateModule.forChild(),
    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [
    AccountsComponent,
    ContactsComponent,
    ContactComponent
  ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [
    AccountsComponent,
    ContactsComponent,
    ContactComponent
  ]
})
export class SalesModule {

  constructor(private injector: Injector,
              private logger: LoggerService) {

    StaticInjectorService.setInjector(injector);
  }

}

/*

// this.logger.info('SalesModule: constructor()');

// import { LoggerService } from './services/logger/logger.service';
// import { ConsoleLoggerService } from './services/logger/console-logger.service';

// { provide: LoggerService, useClass: ConsoleLoggerService }

[ ContactsComponent, AccountsComponent, LoggerService, ConsoleLoggerService ]

// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';

*/
