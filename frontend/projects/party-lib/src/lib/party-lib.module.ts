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

import { AngularMaterialModule } from 'utils-lib';
import { LoggerService } from 'utils-lib';
import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
// import { UtilsLibModule } from 'utils-lib';

//
// Components - local
//

import { AccountComponent } from './components/account/account.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactsComponent } from './components/contacts/contacts.component';

//
// PartyLibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { PartyLibRoutingModule } from './party-lib-routing.module';

const components: any[] = [
  AccountComponent,
  AccountsComponent,
  ContactComponent,
  ContactsComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    DynamicFormsLibModule,
    FlexLayoutModule,
    LeafletModule,
    ReactiveFormsModule,
    SerendipityComponentsLibModule,

    // See core.module.ts
    // UtilsLibModule,

    // https://angular.io/guide/router#routing-module-order
    PartyLibRoutingModule
  ]
})
export class PartyLibModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Party Library initialised');
  }

}
