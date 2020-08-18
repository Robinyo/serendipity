import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DashboardModule } from 'dashboard';
import { DynamicFormsModule } from 'dynamic-forms';
import { FlowableModule } from 'flowable';
import { SerendipityComponentsModule } from 'serendipity-components';
import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

import { LeadsComponent } from './components/leads/leads.component';
import { OpportunitiesComponent } from './components/opportunities/opportunities.component';

import { SalesConfig } from './models/config';
import { SalesConfigService } from './services/config.service';

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
    LeadsComponent,
    OpportunitiesComponent
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
