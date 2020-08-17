import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SalesConfig } from './models/config';
import { SalesConfigService } from './services/config.service';

import { TranslateModule } from '@ngx-translate/core';

import { QuillModule } from 'ngx-quill';

import { AccountComponent } from './components/account/account.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactWizardComponent } from './components/contact-wizard/contact-wizard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmailComponent } from './components/email/email.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

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
// Flowable lib
//

import { FlowableModule } from 'flowable';

//
// Leaflet
//

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

// import { LibRoutingModule } from './lib-routing.module';
import { LazyLibRoutingModule } from './lazy-lib-routing.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DashboardModule,
    FlexLayoutModule,
    FlowableModule,
    QuillModule.forRoot({
      placeholder: ''
    }),
    LeafletModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    UtilsModule,
    SerendipityComponentsModule,
    DynamicFormsModule,

    // https://angular.io/guide/router#routing-module-order
    // LibRoutingModule
    LazyLibRoutingModule
  ],
  declarations: [
    AccountComponent,
    AccountsComponent,
    ContactsComponent,
    ContactComponent,
    ContactWizardComponent,
    EmailComponent,
    DashboardComponent
  ]
})
export class SalesModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Sales Module initialised');
  }

  static forRoot(config: SalesConfig): ModuleWithProviders<SalesModule> {

    return {
      ngModule: SalesModule,
      providers: [
        { provide: SalesConfigService, useValue: config }
      ]
    };

  }

}

/*

  constructor(private injector: Injector,
              private logger: LoggerService) {

    this.logger.info('Sales Module initialised');

    StaticInjectorService.setInjector(injector);
  }

  constructor(private logger: LoggerService) {
    this.logger.info('Sales Module initialised');
  }

*/

/*

1. If 'dashboard' is an Angular component, then verify that it is part of this module.
2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("
<div class="crm-dashboard-container">

  [ERROR ->]<dashboard [dashboardId]="dashboardId"></dashboard>

</div>
")

*/

/*

  entryComponents: [ SnackBarComponent ]
  exports: [
    AccountsComponent,
    ActivitiesComponent,
    ContactsComponent,
    ContactComponent,
    ContactWizardComponent,
    DashboardComponent

    // SnackBarComponent
  ],

*/

// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './services/mocks/api/in-memory-data.service';

// HttpClientInMemoryWebApiModule.forFeature(InMemoryDataService, { passThruUnknownUrl: true, delay: 1000 }),
