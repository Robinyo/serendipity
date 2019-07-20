import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { OktaCallbackComponent } from '@okta/okta-angular';
import { OktaCallbackComponent } from 'okta-angular';

import { LoginComponent } from './components/login/login.component';
import { CallbackComponent } from './components/callback/callback.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'authorization-code/callback',
    component: CallbackComponent
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
