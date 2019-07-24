import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { OktaCallbackComponent } from '@okta/okta-angular';
import { OktaAuthorizationCodeCallbackComponent } from 'okta-angular';
import { OktaImplicitCallbackComponent } from 'okta-angular';

import { LoginComponent } from './components/login/login.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'authorization-code/callback',
    component: OktaAuthorizationCodeCallbackComponent
  },

  {
    path: 'implicit/callback',
    component: OktaImplicitCallbackComponent
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class LibRoutingModule {}
