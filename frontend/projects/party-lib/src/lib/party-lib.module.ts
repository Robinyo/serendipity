import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// import { QuillModule } from 'ngx-quill';

//
// Libs
//

import { DynamicFormsLibModule } from 'dynamic-forms-lib';
import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
import { AngularMaterialModule, LoggerService, UtilsLibModule } from 'utils-lib';

//
// Components - local
//

import { AccountComponent } from './components/account/account.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactWizardComponent } from './components/contact-wizard/contact-wizard.component';

import { LookupAccountDialogComponent } from './components/dialogs/lookup-account-dialog/lookup-account-dialog.component';

//
// PartyLibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { PartyLibRoutingModule } from './party-lib-routing.module';

const components: any[] = [
  AccountComponent,
  AccountListComponent,
  AccountsComponent,
  ContactComponent,
  ContactsComponent,
  ContactWizardComponent,
  LookupAccountDialogComponent
];

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DynamicFormsLibModule,
    FlexLayoutModule,
    LeafletModule,
    ReactiveFormsModule,
    SerendipityComponentsLibModule,
    UtilsLibModule,

    // See core.module.ts
    // UtilsLibModule,

    // https://angular.io/guide/router#routing-module-order
    PartyLibRoutingModule
  ],
  declarations: [
    ...components
  ]
})
export class PartyLibModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Party Library initialised');
  }

}
