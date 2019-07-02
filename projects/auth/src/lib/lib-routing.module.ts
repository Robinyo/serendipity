import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OktaCallbackComponent } from '@okta/okta-angular';

const routes: Routes = [

  {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class LibRoutingModule {}
