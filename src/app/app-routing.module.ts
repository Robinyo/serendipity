import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//
// Auth libs
//

// import { AuthModule, AuthGuard } from 'auth';
// import { AuthOktaModule, authProviders } from 'auth-okta';
import { AuthGuard } from 'auth';
// import { authProviders } from 'auth-okta';

import { PlaceholderComponent } from '@app/core/components/placeholder/placeholder.component';

const routes: Routes = [

  {
    path: 'sales/accounts',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sales/leads',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sales/opportunities',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  //
  // The Wildcard route
  //

  {
    path: '**',
    redirectTo: 'sales/dashboards'
  }

];

@NgModule({
  imports: [
    // AuthModule,
    // AuthOktaModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  providers: [
    // authProviders
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout
