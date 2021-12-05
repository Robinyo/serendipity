import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
import { AngularMaterialModule, LoggerService, UtilsLibModule  } from 'utils-lib';

import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';

//
// FeaturesRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { FeaturesRoutingModule } from './features-routing.module';

const components: any[] = [
  ContactsComponent,
  ContactComponent
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
    UtilsLibModule,

    // https://angular.io/guide/router#routing-module-order
    FeaturesRoutingModule
  ]
})
export class FeaturesModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Party Features Module initialised');
  }

}
