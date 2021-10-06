import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

//
// Utils lib
//

import { AngularMaterialModule } from 'utils-lib';
import { LoggerService } from 'utils-lib';
import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
// import { UtilsLibModule } from 'utils-lib';

//
// Components - local
//

import { ContactsComponent } from './components/contacts/contacts.component';

//
// PartyLibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { PartyLibRoutingModule } from './party-lib-routing.module';

const components: any[] = [
  ContactsComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    HttpClientModule,
    SerendipityComponentsLibModule,

    // See core.module.ts
    // UtilsLibModule,

    // https://angular.io/guide/router#routing-module-order
    PartyLibRoutingModule
  ],
  exports: [
    ...components
  ]
})
export class PartyLibModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Party Library initialised');
  }

}
