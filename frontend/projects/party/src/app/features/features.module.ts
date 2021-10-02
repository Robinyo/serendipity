import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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
    CommonModule,
    HttpClientModule,

    // https://angular.io/guide/router#routing-module-order
    FeaturesRoutingModule
  ]
})
export class FeaturesModule {}
