import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './shared/angular-material.module';

import { AccountsComponent } from './components/accounts/accounts.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';
import { CommandBarComponent } from './components/command-bar/command-bar.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/mocks/api/in-memory-data.service';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';
import { StaticInjectorService } from 'utils';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';
// import { DynamicFormComponent } from 'dynamic-forms';

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,

    HttpClientInMemoryWebApiModule.forFeature(InMemoryDataService, { passThruUnknownUrl: true, delay: 1500 }),

    TranslateModule.forChild(),

    UtilsModule,
    DynamicFormsModule,

    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [
    AccountsComponent,
    CommandBarComponent,
    ContactsComponent,
    ContactComponent
  ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [
    AccountsComponent,
    CommandBarComponent,
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
