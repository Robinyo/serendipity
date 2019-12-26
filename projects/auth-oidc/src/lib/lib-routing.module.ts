import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationCodeCallbackComponent } from './components/authorization-code/authorization-code.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';
import { ImplicitCallbackComponent } from './components/implicit-callback/implicit-callback.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginRedirectComponent
  },

  {
    path: 'authorization-code/callback',
    component: AuthorizationCodeCallbackComponent
  },

  {
    path: 'implicit/callback',
    component: ImplicitCallbackComponent
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class LibRoutingModule {}
