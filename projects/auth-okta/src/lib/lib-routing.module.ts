import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OktaCallbackComponent } from '@okta/okta-angular';

import { LoginComponent } from './components/login/login.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

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
