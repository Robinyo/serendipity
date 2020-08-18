import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { QuillModule } from 'ngx-quill';

import { DashboardModule } from 'dashboard';
import { DynamicFormsModule } from 'dynamic-forms';
import { FlowableModule } from 'flowable';
import { SerendipityComponentsModule } from 'serendipity-components';
import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

import { AccountComponent } from './components/account/account.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactWizardComponent } from './components/contact-wizard/contact-wizard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { PartyConfig } from './models/config';
import { PartyConfigService } from './services/config.service';

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
    DynamicFormsModule,
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
    DashboardComponent
  ]
})
export class PartyModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Sales Module initialised');
  }

  static forRoot(config: PartyConfig): ModuleWithProviders<PartyModule> {

    return {
      ngModule: PartyModule,
      providers: [
        { provide: PartyConfigService, useValue: config }
      ]
    };

  }

}
